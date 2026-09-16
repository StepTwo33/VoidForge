"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Loader2 } from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [useGoogle, setUseGoogle] = useState(false);
    const [loading, setLoading] = useState(false);

    const passwordStrength = (() => {
        if (password.length === 0) return null;
        if (password.length < 8) return { label: "Too short", color: "text-destructive", bar: "bg-destructive", width: "w-1/4" };
        let score = 0;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        if (password.length >= 12) score++;
        if (score <= 1) return { label: "Weak", color: "text-orange-700 dark:text-orange-400", bar: "bg-orange-600 dark:bg-orange-400", width: "w-2/4" };
        if (score <= 2) return { label: "Good", color: "text-yellow-700 dark:text-yellow-400", bar: "bg-yellow-600 dark:bg-yellow-400", width: "w-3/4" };
        return { label: "Strong", color: "text-green-700 dark:text-green-400", bar: "bg-green-600 dark:bg-green-400", width: "w-full" };
    })();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name: name.trim() || undefined }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                setUseGoogle(!!data.useGoogle);
                setLoading(false);
                return;
            }

            router.push(`/verify?email=${encodeURIComponent(email)}`);
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <PageShell>
            <div className="container mx-auto flex flex-1 items-center justify-center px-3.5 py-10 animate-in fade-in slide-in-from-bottom-8 duration-700 sm:px-4 sm:py-16">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                            <UserPlus className="h-7 w-7 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">Create an account</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sign up to save your builds and access them anywhere
                        </p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Display Name <span className="text-muted-foreground/50">(optional)</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tenno"
                                    className="h-11 w-full min-h-11 rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-base transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tenno@example.com"
                                    required
                                    className="h-11 w-full min-h-11 rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-base transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="h-11 w-full min-h-11 rounded-lg border border-border bg-background py-2.5 pl-10 pr-12 text-base transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 min-h-11 min-w-11 inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {passwordStrength && (
                                <div className="mt-2">
                                    <div className="h-1 rounded-full bg-border overflow-hidden">
                                        <div className={`h-full rounded-full ${passwordStrength.bar} ${passwordStrength.width} transition-all duration-300`} />
                                    </div>
                                    <p className={`text-[10px] mt-1 ${passwordStrength.color}`}>{passwordStrength.label}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="h-11 w-full min-h-11 rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-base transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
                                />
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-[10px] mt-1 text-destructive">Passwords do not match</p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs">
                                <p className="text-destructive">{error}</p>
                                {useGoogle && (
                                    <a
                                        href="/api/auth/signin/google"
                                        className="mt-2.5 w-full min-h-11 py-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:border-foreground/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Sign in with Google instead
                                    </a>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full min-h-11 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <UserPlus className="h-4 w-4" />
                            )}
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground mt-4">
                        Already have an account?{" "}
                        <Link href="/signin" className="inline-flex min-h-11 items-center text-primary hover:text-primary/80 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">or</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Google OAuth */}
                    <a
                        href="/api/auth/signin/google"
                        className="w-full min-h-11 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </a>
                </div>
            </div>
        </PageShell>
    );
}
