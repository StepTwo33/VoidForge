import { NextRequest, NextResponse } from "next/server";
import {
    validateVerificationToken,
    findUserByEmailInsensitive,
    createSession,
    buildSessionUser,
    SESSION_COOKIE,
    framehubSessionCookieOptions,
} from "@/lib/auth/auth";
import { isUserBanned } from "@/lib/auth/admin";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { getPublicOrigin } from "@/lib/site/public-origin";
import { logServerError } from "@/lib/log-server-error";
import { readJsonBodyLimited } from "@/lib/read-json-body";

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req.headers);
        const rl = checkRateLimit(`verify:${ip}`, 5, 15 * 60 * 1000);
        if (rl.limited) {
            return NextResponse.json(
                { error: "Too many verification attempts. Please try again later." },
                { status: 429 }
            );
        }

        const parsed = await readJsonBodyLimited(req);
        if (!parsed.ok) return parsed.response;
        const { email, code } = parsed.body as { email?: string; code?: string };

        if (!email || !code) {
            return NextResponse.json(
                { error: "Email and verification code are required" },
                { status: 400 }
            );
        }

        // Per-account limit so a spoofed client IP can't brute-force the 6-digit code.
        const accountRl = checkRateLimit(`verify-account:${email.toLowerCase()}`, 10, 15 * 60 * 1000);
        if (accountRl.limited) {
            return NextResponse.json(
                { error: "Too many verification attempts. Please try again later." },
                { status: 429 }
            );
        }

        // Look up the user first (case-insensitive) so token validation and the
        // emailVerified update both use the email stored on the user row.
        const user = await findUserByEmailInsensitive(email);
        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired verification code" },
                { status: 400 }
            );
        }

        if (isUserBanned(user)) {
            return NextResponse.json(
                { error: "This account has been suspended. Contact support if you believe this is a mistake." },
                { status: 403 }
            );
        }

        const valid = await validateVerificationToken(user.email!, code);
        if (!valid) {
            return NextResponse.json(
                { error: "Invalid or expired verification code" },
                { status: 400 }
            );
        }

        const sessionUser = await buildSessionUser({ ...user, emailVerified: new Date() });
        const token = await createSession(sessionUser);

        const origin = getPublicOrigin(req);

        const response = NextResponse.json({ success: true });
        response.cookies.set(SESSION_COOKIE, token, framehubSessionCookieOptions(origin));

        return response;
    } catch (error) {
        logServerError("Email verification error", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
