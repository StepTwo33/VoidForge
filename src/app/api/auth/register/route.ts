import { NextRequest, NextResponse } from "next/server";
import {
    hashPassword,
    generateVerificationCode,
    storeVerificationToken,
    findUserByEmail,
    generateUniqueUsername,
} from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/auth/email";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { logServerError } from "@/lib/log-server-error";
import { readJsonBodyLimited } from "@/lib/read-json-body";

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req.headers);
        const rl = checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
        if (rl.limited) {
            return NextResponse.json(
                { error: "Too many registration attempts. Please try again later." },
                { status: 429 }
            );
        }

        const parsed = await readJsonBodyLimited(req);
        if (!parsed.ok) return parsed.response;
        const { email, password, name, newsletterOptIn } = parsed.body as {
            email?: string;
            password?: string;
            name?: string;
            newsletterOptIn?: unknown;
        };

        // ---------- Validation ----------
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const rawEmail = email.trim();
        const normalizedEmail = rawEmail.toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Per-email limit so a spoofed client IP can't spam a target inbox with signups.
        const emailRl = checkRateLimit(`register-email:${normalizedEmail}`, 3, 60 * 60 * 1000);
        if (emailRl.limited) {
            return NextResponse.json(
                { error: "Too many registration attempts. Please try again later." },
                { status: 429 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // ---------- Check for existing user ----------
        // Check both the raw and lowercased form: SQLite unique is case-sensitive,
        // so older accounts may exist under a mixed-case email.
        const existing =
            (await findUserByEmail(rawEmail)) ??
            (rawEmail !== normalizedEmail ? await findUserByEmail(normalizedEmail) : null);
        if (existing) {
            if (!existing.passwordHash) {
                return NextResponse.json(
                    { error: "This email is linked to a Google account. Please sign in with Google instead.", useGoogle: true },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // ---------- Create user ----------
        const passwordHash = await hashPassword(password);
        const username = await generateUniqueUsername(name?.trim() || normalizedEmail.split("@")[0] || "tenno");
        const createdUser = await prisma.user.create({
            data: {
                email: normalizedEmail,
                name: name?.trim() || null,
                username,
                passwordHash,
                emailVerified: null,
                // Opt-in only: on just when the sign-up checkbox was ticked.
                newsletterOptIn: newsletterOptIn === true,
            },
        });

        // ---------- Verification code ----------
        // If we can't deliver the verification email, roll back the account so
        // the user isn't stranded (exists but can never verify or re-register).
        try {
            const code = generateVerificationCode();
            await storeVerificationToken(normalizedEmail, code);
            await sendVerificationEmail(normalizedEmail, code);
        } catch (emailError) {
            logServerError("Registration verification email failed", emailError);
            try {
                await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail } });
                await prisma.user.delete({ where: { id: createdUser.id } });
            } catch (cleanupError) {
                logServerError("Registration rollback failed", cleanupError);
            }
            return NextResponse.json(
                { error: "Could not send verification email. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "Account created. Check your email for a verification code." });
    } catch (error) {
        logServerError("Registration error", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
