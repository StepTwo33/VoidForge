"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageShell, PageMain, PageHero } from "@/components/page-shell";
import { cn } from "@/lib/utils";
import { Ban, Search, Shield, Heart, RotateCcw, Users, Mail, MailX } from "lucide-react";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";

interface AdminUser {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  role: string;
  bannedAt: string | null;
  banReason: string | null;
  supporterAt: string | null;
  newsletterOptIn: boolean;
  createdAt: string;
  _count: { builds: number };
}

export default function AdminUsersPage() {
  const { prompt } = useConfirmDialog();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isFullAdmin, setIsFullAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const refresh = useCallback((query?: string) => {
    const q = query ?? search;
    const url = q.trim() ? `/api/admin/users?q=${encodeURIComponent(q.trim())}` : "/api/admin/users";
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data.users)) setUsers(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        const role = data.user?.role;
        if (role === "admin" || role === "moderator") {
          setAuthorized(true);
          setIsFullAdmin(role === "admin");
          refresh("");
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [refresh]);

  const runAction = async (userId: string, action: string, extra?: Record<string, string>) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleBan = async (user: AdminUser) => {
    const label = user.username ?? user.email ?? user.id;
    const reason = await prompt({
      title: `Ban ${label}?`,
      description: "Optional reason (e.g. inappropriate build description). Leave blank if none.",
      defaultValue: user.banReason ?? "",
      confirmLabel: "Ban user",
      destructive: true,
    });
    if (reason === null) return;
    void runAction(user.id, "ban", { reason });
  };

  if (loading) {
    return (
      <PageShell>
        <PageMain maxWidth="lg" className="py-12 text-center text-muted-foreground">
          Loading…
        </PageMain>
      </PageShell>
    );
  }

  if (!authorized) {
    return (
      <PageShell>
        <PageMain maxWidth="md" className="py-12 text-center">
          <Shield className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h1 className="text-lg font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">You need moderator or admin access.</p>
        </PageMain>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageMain maxWidth="lg">
        <PageHero
          icon={Users}
          accent="red"
          title="User"
          highlight="Management"
          description="Ban accounts for policy violations, unpublish their public builds, and manage roles."
        />

        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && refresh(search)}
              placeholder="Search by email, username, or name…"
              className="w-full rounded-lg border border-border bg-background/60 py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => refresh(search)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary/60"
          >
            Search
          </button>
        </div>

        <div className="space-y-2">
          {users.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No users found.</p>
          ) : (
            users.map((user) => {
              const banned = Boolean(user.bannedAt);
              const isSupporter = Boolean(user.supporterAt);
              const newsletterOn = user.newsletterOptIn !== false;
              return (
                <div
                  key={user.id}
                  className={cn(
                    "rounded-xl border p-4",
                    banned ? "border-red-500/30 bg-red-500/5" : "border-border bg-card/40",
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{user.name ?? user.username ?? "Tenno"}</span>
                        {user.username && (
                          <Link href={`/u/${user.username}`} className="text-xs text-primary hover:underline">
                            @{user.username}
                          </Link>
                        )}
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                          {user.role}
                        </span>
                        {banned && (
                          <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-400">
                            Banned
                          </span>
                        )}
                        {isSupporter && (
                          <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-400">
                            Supporter
                          </span>
                        )}
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            newsletterOn
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {newsletterOn ? "Newsletter" : "Unsubscribed"}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{user.email ?? "No email"}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/80">
                        {user._count.builds} builds · joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      {user.banReason && (
                        <p className="mt-2 text-xs text-red-300/90">Reason: {user.banReason}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      {banned ? (
                        <button
                          type="button"
                          disabled={actionLoading === user.id}
                          onClick={() => runAction(user.id, "unban")}
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary/60"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Unban
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={actionLoading === user.id}
                          onClick={() => handleBan(user)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Ban
                        </button>
                      )}
                      {newsletterOn ? (
                        <button
                          type="button"
                          disabled={actionLoading === user.id}
                          onClick={() => runAction(user.id, "unsubscribeNewsletter")}
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary/60"
                        >
                          <MailX className="h-3.5 w-3.5" />
                          Unsubscribe
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={actionLoading === user.id}
                          onClick={() => runAction(user.id, "subscribeNewsletter")}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Resubscribe
                        </button>
                      )}
                      {isFullAdmin && (
                        <>
                          {isSupporter ? (
                            <button
                              type="button"
                              disabled={actionLoading === user.id}
                              onClick={() => runAction(user.id, "revokeSupporter")}
                              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary/60"
                            >
                              <Heart className="h-3.5 w-3.5" />
                              Revoke Supporter
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={actionLoading === user.id}
                              onClick={() => runAction(user.id, "grantSupporter")}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
                            >
                              <Heart className="h-3.5 w-3.5" />
                              Grant Supporter
                            </button>
                          )}
                          <select
                            value={user.role}
                            disabled={actionLoading === user.id}
                            onChange={(e) => runAction(user.id, "setRole", { role: e.target.value })}
                            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                          >
                            <option value="user">user</option>
                            <option value="moderator">moderator</option>
                            <option value="admin">admin</option>
                          </select>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PageMain>
    </PageShell>
  );
}
