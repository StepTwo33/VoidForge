import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isUserBanned, syncBootstrapAdminRole } from "@/lib/auth/admin";
import crypto from "crypto";

const SESSION_COOKIE = "framehub_session";
const AUTH_SECRET_RAW = process.env.AUTH_SECRET;
if (!AUTH_SECRET_RAW && process.env.NODE_ENV === "production") {
  throw new Error("AUTH_SECRET environment variable is required in production");
}
const secret = new TextEncoder().encode(AUTH_SECRET_RAW || "dev-secret-change-me");

export interface Session {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
    image: string | null;
    emailVerified: boolean;
    role: string;
  };
}

/** Auth lookups — omit optional columns so login works before every migration is applied. */
const AUTH_USER_SELECT = {
  id: true,
  name: true,
  username: true,
  email: true,
  image: true,
  emailVerified: true,
  role: true,
  passwordHash: true,
  bannedAt: true,
} as const;

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 24;
const USERNAME_PATTERN = /^[a-z0-9._-]+$/;

function buildUsernameFallback(): string {
  return `tenno-${crypto.randomBytes(3).toString("hex")}`;
}

export function normalizeUsername(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/[-._]{2,}/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "")
    .slice(0, USERNAME_MAX_LENGTH);
}

export function isValidUsername(input: string): boolean {
  return (
    input.length >= USERNAME_MIN_LENGTH
    && input.length <= USERNAME_MAX_LENGTH
    && USERNAME_PATTERN.test(input)
  );
}

export async function generateUniqueUsername(seed: string): Promise<string> {
  const normalized = normalizeUsername(seed);
  const base = (normalized.length >= USERNAME_MIN_LENGTH ? normalized : buildUsernameFallback())
    .slice(0, USERNAME_MAX_LENGTH);

  let candidate = base;
  let suffix = 1;

  while (await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } })) {
    const suffixText = `-${suffix}`;
    candidate = `${base.slice(0, USERNAME_MAX_LENGTH - suffixText.length)}${suffixText}`;
    suffix += 1;
  }

  return candidate;
}

type AuthUserRow = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  emailVerified: Date | null;
  role: string;
  bannedAt?: Date | null;
};

/** Sync env-based admin role and map a DB user row to JWT session payload. */
export async function buildSessionUser(
  user: AuthUserRow,
  emailVerifiedOverride?: boolean,
): Promise<Session["user"]> {
  const role = await syncBootstrapAdminRole(user.id, user.email, user.role);
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email!,
    image: user.image,
    emailVerified: !!(user.emailVerified || emailVerifiedOverride),
    role,
  };
}

// --------------- Password Hashing (PBKDF2) ---------------

/**
 * Iteration count for newly created hashes. Older hashes stored the iteration
 * count implicitly (see LEGACY_PBKDF2_ITERATIONS); we now encode it in the hash
 * (`salt:key:iterations`) so this can be raised without locking out existing users.
 */
const PBKDF2_ITERATIONS = 600_000;
/** Hashes written before iterations were encoded used this fixed count. */
const LEGACY_PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, "sha256");
  return `${salt.toString("hex")}:${key.toString("hex")}:${PBKDF2_ITERATIONS}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [saltHex, keyHex, iterationsRaw] = hash.split(":");
  if (!saltHex || !keyHex) return false;
  const iterations = iterationsRaw ? Number.parseInt(iterationsRaw, 10) : LEGACY_PBKDF2_ITERATIONS;
  if (!Number.isFinite(iterations) || iterations <= 0) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expectedKey = Buffer.from(keyHex, "hex");
  const actualKey = crypto.pbkdf2Sync(password, salt, iterations, KEY_LENGTH, "sha256");
  if (actualKey.length !== expectedKey.length) return false;
  return crypto.timingSafeEqual(expectedKey, actualKey);
}

// --------------- Verification Codes ---------------

export function generateVerificationCode(): string {
  return crypto.randomInt(100_000, 999_999).toString();
}

export async function storeVerificationToken(email: string, code: string): Promise<void> {
  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  // Create new token (expires in 10 minutes)
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: code,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
}

export async function validateVerificationToken(
  email: string,
  code: string
): Promise<boolean> {
  const record = await prisma.verificationToken.findFirst({
    where: { identifier: email, token: code },
  });
  if (!record) return false;
  if (record.expires < new Date()) {
    // Expired — clean up
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: code } },
    });
    return false;
  }
  // Valid — delete the used token and mark email as verified
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: code } },
  });
  await prisma.user.updateMany({
    where: { email },
    data: { emailVerified: new Date() },
  });
  return true;
}

// --------------- User DB Helpers ---------------

export async function findOrCreateUser(
  email: string,
  data: { name?: string | null; image?: string | null; emailVerified?: boolean; provider?: string; providerAccountId?: string }
): Promise<Session["user"]> {
  let user = await prisma.user.findUnique({ where: { email }, select: AUTH_USER_SELECT });

  if (!user) {
    const username = await generateUniqueUsername(data.name ?? email.split("@")[0] ?? "tenno");
    user = await prisma.user.create({
      data: {
        email,
        name: data.name ?? null,
        username,
        image: data.image ?? null,
        emailVerified: data.emailVerified ? new Date() : null,
        // Google sign-up has no checkbox, so new accounts start opted out (Profile → Settings to opt in).
        newsletterOptIn: false,
      },
      select: AUTH_USER_SELECT,
    });
  }

  // If this is an OAuth login, ensure the Account link exists and merge profile
  if (data.provider && data.providerAccountId) {
    const existing = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        },
      },
    });
    if (!existing) {
      await prisma.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        },
      });
    }
    // Merge profile: fill in missing name/image from OAuth provider, verify email
    const updates: Record<string, unknown> = {};
    if (!user.name && data.name) updates.name = data.name;
    if (!user.image && data.image) updates.image = data.image;
    if (!user.emailVerified) updates.emailVerified = new Date();
    if (Object.keys(updates).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updates,
        select: AUTH_USER_SELECT,
      });
    }
  }

  if (isUserBanned(user)) {
    throw new Error("ACCOUNT_BANNED");
  }

  return buildSessionUser(user, data.emailVerified);
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: AUTH_USER_SELECT });
}

/**
 * Case-insensitive email lookup. SQLite unique columns are case-sensitive, so
 * existing rows may be stored with mixed casing; try the exact string first,
 * then the lowercased form. Callers should use the returned `user.email` for
 * any follow-up queries so they stay consistent with the stored row.
 */
export async function findUserByEmailInsensitive(email: string) {
  const trimmed = email.trim();
  const exact = await prisma.user.findUnique({ where: { email: trimmed }, select: AUTH_USER_SELECT });
  if (exact) return exact;
  const lower = trimmed.toLowerCase();
  if (lower === trimmed) return null;
  return prisma.user.findUnique({ where: { email: lower }, select: AUTH_USER_SELECT });
}

// --------------- Session (JWT) ---------------

export async function createSession(user: Session["user"]): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(secret);
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

// --------------- Google OAuth ---------------

export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getGoogleAuthUrl(callbackUrl: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCodeForUser(
  code: string,
  callbackUrl: string
): Promise<{ id: string; name: string | null; email: string; image: string | null } | null> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: callbackUrl,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) return null;
  const tokens = await tokenRes.json();

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) return null;
  const profile = await userRes.json();

  return {
    id: profile.id,
    name: profile.name ?? null,
    email: profile.email,
    image: profile.picture ?? null,
  };
}

const SESSION_MAX_AGE_SEC = 30 * 24 * 60 * 60;

/** Cookie flags for `framehub_session` — keep in sync everywhere it is set or cleared. */
export function framehubSessionCookieOptions(publicOrigin: string) {
  return {
    httpOnly: true,
    secure: publicOrigin.startsWith("https"),
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

export function clearFramehubSessionCookieOptions(publicOrigin: string) {
  return {
    httpOnly: true,
    secure: publicOrigin.startsWith("https"),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

/** OAuth CSRF cookie — same shape for set (Google redirect) and clear (callback). */
export function oauthStateCookieOptions(publicOrigin: string, maxAgeSec: number) {
  return {
    httpOnly: true,
    secure: publicOrigin.startsWith("https"),
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

export { SESSION_COOKIE };
