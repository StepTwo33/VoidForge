import { NextRequest, NextResponse } from "next/server";
import {
    findUserByEmailInsensitive,
    generateVerificationCode,
    storeVerificationToken,
} from "@/lib/auth/auth";
import { sendVerificationEmail } from "@/lib/auth/email";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { logServerError } from "@/lib/log-server-error";
import { readJsonBodyLimited } from "@/lib/read-json-body";

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req.headers);
        const rl = checkRateLimit(`resend:${ip}`, 3, 15 * 60 * 1000);
        if (rl.limited) {
            return NextResponse.json(
                { error: "Too many attempts. Please try again later." },
                { status: 429 }
            );
        }

        const parsed = await readJsonBodyLimited(req);
        if (!parsed.ok) return parsed.response;
        const { email } = parsed.body as { email?: string };

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Per-account limit so a spoofed client IP can't spam a target inbox with codes.
        const accountRl = checkRateLimit(`resend-account:${email.toLowerCase()}`, 3, 15 * 60 * 1000);
        if (accountRl.limited) {
            return NextResponse.json(
                { error: "Too many attempts. Please try again later." },
                { status: 429 }
            );
        }

        const user = await findUserByEmailInsensitive(email);
        if (!user || user.emailVerified) {
            // Don't reveal whether the email exists or is already verified
            return NextResponse.json({
                success: true,
                message: "If an account exists and needs verification, a new code has been sent.",
            });
        }

        // Use the stored email so the token identifier matches the user row.
        const code = generateVerificationCode();
        await storeVerificationToken(user.email!, code);
        await sendVerificationEmail(user.email!, code);

        return NextResponse.json({ success: true, message: "A new verification code has been sent." });
    } catch (error) {
        logServerError("Resend verification error", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
