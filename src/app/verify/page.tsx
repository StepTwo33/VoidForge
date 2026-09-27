"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { MailCheck, Loader2, RefreshCw } from "lucide-react";

function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newCode.every((d) => d !== "")) {
            handleSubmit(newCode.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 0) return;
        const newCode = [...code];
        for (let i = 0; i < 6; i++) {
            newCode[i] = pasted[i] || "";
        }
        setCode(newCode);
        if (pasted.length === 6) {
            handleSubmit(pasted);
        } else {
            inputRefs.current[pasted.length]?.focus();
        }
    };

    const handleSubmit = async (codeStr?: string) => {
        const fullCode = codeStr || code.join("");
        if (fullCode.length !== 6) {
            setError("Please enter the full 6-digit code");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: fullCode }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Verification failed");
                setCode(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
                setLoading(false);
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setResent(false);
        setError("");

        try {
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setResent(true);
                setTimeout(() => setResent(false), 5000);
            }
        } catch {
            setError("Failed to resend code");
        } finally {
            setResending(false);
        }
    };

    if (!email) {
        return (
            <PageShell>
                <div className="container mx-auto px-3.5 py-10 text-center sm:px-4 sm:py-16">
                    <p className="text-sm text-muted-foreground">
                        No email address provided.{" "}
                        <Link
                            href="/signup"
                            className="inline-flex min-h-11 items-center text-primary underline-offset-2 hover:underline"
                        >
                            Return to signup
                        </Link>{" "}
                        and try again.
                    </p>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="container mx-auto flex items-center justify-center px-3.5 py-10 sm:px-4 sm:py-16">
                <div className="w-full max-w-md text-center">
                    <div className="mb-8">
                        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                            <MailCheck className="h-7 w-7 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">Verify your email</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            We sent a 6-digit code to{" "}
                            <span className="break-all font-medium text-foreground">{email}</span>
                        </p>
                    </div>

                    <div className="mb-6 flex justify-center gap-1.5 sm:gap-2" onPaste={handlePaste}>
                        {code.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="h-12 min-h-11 w-10 min-w-10 rounded-lg border border-border bg-background text-center text-lg font-bold transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 sm:h-14 sm:w-12 sm:min-w-11"
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-700 dark:border-destructive/20 dark:bg-destructive/10 dark:text-destructive">
                            {error}
                        </div>
                    )}

                    {resent && (
                        <div className="mb-4 rounded-lg border border-green-500/25 bg-green-500/10 p-3 text-xs text-green-800 dark:text-green-400">
                            A new code has been sent to your email
                        </div>
                    )}

                    <button
                        onClick={() => handleSubmit()}
                        disabled={loading || code.some((d) => !d)}
                        className="mb-4 flex w-full min-h-11 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MailCheck className="h-4 w-4" />
                        )}
                        {loading ? "Verifying..." : "Verify email"}
                    </button>

                    <button
                        onClick={handleResend}
                        disabled={resending}
                        className="mx-auto flex w-full min-h-11 items-center justify-center gap-1.5 rounded-lg text-xs text-muted-foreground transition-colors hover:text-foreground sm:w-auto"
                    >
                        {resending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <RefreshCw className="h-3 w-3" />
                        )}
                        {resending ? "Sending..." : "Resend code"}
                    </button>

                    <p className="mt-6 text-[10px] text-muted-foreground/50">
                        Code expires in 10 minutes. Check your inbox and spam folder.
                    </p>
                </div>
            </div>
        </PageShell>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <PageShell>
                <div className="container mx-auto px-3.5 py-10 text-center sm:px-4 sm:py-16">
                    <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-muted" />
                </div>
            </PageShell>
        }>
            <VerifyForm />
        </Suspense>
    );
}
