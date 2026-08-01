"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Trash2, Crosshair, Shield, Dog, Wrench, Plane, LogIn, Camera, Loader2, Check, X, Pencil, Calendar, User as UserIcon, Mail, FileText, Flag, CheckCircle2, Ban, CircleDot, ChevronRight, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildOpenUrl } from "@/lib/builds/build-url";
import { AvatarImage } from "@/components/game-asset-image";
import { AvatarCropDialog } from "@/components/avatar-crop-dialog";
import { SupporterBadge } from "@/components/supporter-badge";
import { RoleBadge } from "@/components/role-badge";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";

interface ProfileUser {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  role: string;
  supporterAt: string | null;
  newsletterOptIn: boolean;
  createdAt: string;
  _count: { builds: number; reports: number };
}

interface CloudBuild {
  id: string;
  name: string;
  description?: string;
  type: string;
  isPublic?: boolean;
  upvoteCount?: number;
  data: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

interface UserReport {
  id: string;
  itemType: string;
  itemName: string;
  itemId: string;
  status: string;
  comment: string;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

const typeIcons: Record<string, typeof Crosshair> = {
  weapon: Crosshair,
  warframe: Shield,
  companion: Dog,
  modular: Wrench,
  archwing: Plane,
  railjack: Crosshair,
  loadout: FolderOpen,
};

const typeColors: Record<string, string> = {
  weapon: "text-blue-400 border-blue-500/30",
  warframe: "text-purple-400 border-purple-500/30",
  companion: "text-cyan-400 border-cyan-500/30",
  modular: "text-orange-400 border-orange-500/30",
  archwing: "text-teal-400 border-teal-500/30",
  railjack: "text-rose-400 border-rose-500/30",
  loadout: "text-green-400 border-green-500/30",
};

export default function ProfilePage() {
  const { confirm } = useConfirmDialog();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [builds, setBuilds] = useState<CloudBuild[]>([]);
  const [buildsLoading, setBuildsLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"builds" | "reports" | "settings">("builds");
  const [reports, setReports] = useState<UserReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  // Edit states
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarCropOpen, setAvatarCropOpen] = useState(false);
  const [avatarCropSrc, setAvatarCropSrc] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const avatarCropSrcRef = useRef<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch full profile from dedicated endpoint
    fetch("/api/auth/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setUsernameInput(data.user.username ?? "");
          setNameInput(data.user.name ?? "");
          setBioInput(data.user.bio ?? "");
        }
        setLoading(false);
        if (data.user) {
          setBuildsLoading(true);
          fetch("/api/builds")
            .then((r) => r.json())
            .then((b) => { setBuilds(Array.isArray(b) ? b : []); setBuildsLoading(false); })
            .catch(() => setBuildsLoading(false));
        }
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab !== "reports" || !user) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setReportsLoading(true);
    });
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setReports(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setReports([]);
      })
      .finally(() => {
        if (!cancelled) setReportsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, user]);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 3000);
  }, []);

  const notifyProfileUpdated = useCallback(() => {
    window.dispatchEvent(new CustomEvent("framehub-profile-updated"));
  }, []);

  const handleSaveUsername = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, ...data.user } : prev);
        setUsernameInput(data.user.username ?? "");
        setEditingUsername(false);
        showMessage("success", "Username updated");
        notifyProfileUpdated();
      } else {
        showMessage("error", data.error || "Failed to update username");
      }
    } catch {
      showMessage("error", "Something went wrong");
    }
    setSaving(false);
  }, [user, usernameInput, showMessage, notifyProfileUpdated]);

  const handleSaveName = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, ...data.user } : prev);
        setEditingName(false);
        showMessage("success", "Name updated");
        notifyProfileUpdated();
      } else {
        showMessage("error", data.error || "Failed to update name");
      }
    } catch {
      showMessage("error", "Something went wrong");
    }
    setSaving(false);
  }, [user, nameInput, showMessage, notifyProfileUpdated]);

  const handleSaveBio = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bioInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, ...data.user } : prev);
        setEditingBio(false);
        showMessage("success", "Bio updated");
      } else {
        showMessage("error", data.error || "Failed to update bio");
      }
    } catch {
      showMessage("error", "Something went wrong");
    }
    setSaving(false);
  }, [user, bioInput, showMessage]);

  const handleNewsletterToggle = useCallback(async (next: boolean) => {
    if (!user) return;
    setSaving(true);
    const prev = user.newsletterOptIn;
    setUser((u) => (u ? { ...u, newsletterOptIn: next } : u));
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterOptIn: next }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser((u) => (u ? { ...u, ...data.user } : u));
        showMessage("success", next ? "Newsletter emails enabled" : "Opted out of newsletters");
      } else {
        setUser((u) => (u ? { ...u, newsletterOptIn: prev } : u));
        showMessage("error", data.error || "Failed to update preference");
      }
    } catch {
      setUser((u) => (u ? { ...u, newsletterOptIn: prev } : u));
      showMessage("error", "Something went wrong");
    }
    setSaving(false);
  }, [user, showMessage]);

  const handleAvatarUpload = useCallback(async (file: File) => {
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/auth/profile/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, image: data.image } : prev);
        showMessage("success", "Avatar updated");
        notifyProfileUpdated();
      } else {
        showMessage("error", data.error || "Failed to upload avatar");
      }
    } catch {
      showMessage("error", "Something went wrong");
    }
    setAvatarUploading(false);
  }, [showMessage, notifyProfileUpdated]);

  const closeAvatarCrop = useCallback(() => {
    setAvatarCropOpen(false);
    if (avatarCropSrcRef.current) {
      URL.revokeObjectURL(avatarCropSrcRef.current);
      avatarCropSrcRef.current = null;
    }
    setAvatarCropSrc(null);
  }, []);

  const handlePickAvatarFile = useCallback((file: File) => {
    if (avatarCropSrcRef.current) URL.revokeObjectURL(avatarCropSrcRef.current);
    const url = URL.createObjectURL(file);
    avatarCropSrcRef.current = url;
    setAvatarCropSrc(url);
    setAvatarCropOpen(true);
  }, []);

  const handleRemoveAvatar = useCallback(async () => {
    setAvatarUploading(true);
    try {
      const res = await fetch("/api/auth/profile/avatar", { method: "DELETE" });
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, image: null } : prev);
        showMessage("success", "Avatar removed");
        notifyProfileUpdated();
      }
    } catch {
      showMessage("error", "Something went wrong");
    }
    setAvatarUploading(false);
  }, [showMessage, notifyProfileUpdated]);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete build?",
      description: "This build will be permanently removed from your account.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    const res = await fetch(`/api/builds/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBuilds((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleTogglePublic = async (build: CloudBuild) => {
    const nextPublic = !build.isPublic;
    const res = await fetch("/api/builds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: build.id,
        name: build.name,
        description: build.description ?? "",
        isPublic: nextPublic,
        type: build.type,
        data: build.data,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBuilds((prev) =>
        prev.map((b) =>
          b.id === build.id
            ? { ...b, isPublic: updated.isPublic, upvoteCount: updated.upvoteCount }
            : b
        )
      );
      showMessage("success", nextPublic ? "Build listed in Community Builds" : "Build removed from community listing");
    } else {
      showMessage("error", "Could not update visibility");
    }
  };

  const filteredBuilds = filter === "all" ? builds : builds.filter((b) => b.type === filter);
  const buildCounts = builds.reduce((acc, b) => { acc[b.type] = (acc[b.type] || 0) + 1; return acc; }, {} as Record<string, number>);

  if (loading) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-muted" />
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="container mx-auto max-w-md px-4 py-16 text-center">
          <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view your profile</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to save builds to the cloud and access them from anywhere.
          </p>
          <a
            href="/signin"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <LogIn className="h-4 w-4" /> Sign in
          </a>
        </div>
      </PageShell>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const publicProfileHref = user.username ? `/u/${user.username}` : null;

  return (
    <PageShell>
      <div className="container mx-auto max-w-4xl px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Save message toast */}
        {saveMessage && (
          <div className={cn(
            "fixed top-20 right-4 z-50 px-4 py-2.5 rounded-lg border text-sm font-medium shadow-lg animate-in slide-in-from-top-2 fade-in duration-200",
            saveMessage.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          )}>
            {saveMessage.type === "success" ? <Check className="inline h-3.5 w-3.5 mr-1.5" /> : <X className="inline h-3.5 w-3.5 mr-1.5" />}
            {saveMessage.text}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="relative p-4 sm:p-6 rounded-xl border border-border bg-card/60 backdrop-blur-md mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            {/* Avatar */}
            <div className="relative group">
              {user.image ? (
                <AvatarImage src={user.image} alt="" size={80} className="w-20 h-20 rounded-full border-2 border-border object-cover bg-background" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  <span className="text-3xl font-bold text-muted-foreground">{user.name?.[0]?.toUpperCase() ?? "?"}</span>
                </div>
              )}
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                {avatarUploading ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePickAvatarFile(file);
                  e.target.value = "";
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{user.name ?? "Tenno"}</h1>
                <button
                  type="button"
                  onClick={() => { setActiveTab("settings"); setEditingName(true); setNameInput(user.name ?? ""); }}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors shrink-0"
                  title="Edit display name"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                {user.role === "admin" && <RoleBadge role="admin" />}
                {user.role === "moderator" && <RoleBadge role="moderator" />}
                {user.supporterAt && <SupporterBadge />}
              </div>
              {publicProfileHref ? (
                <Link href={publicProfileHref} className="text-xs text-primary hover:underline mb-2 inline-block">
                  @{user.username}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => { setActiveTab("settings"); setEditingUsername(true); setUsernameInput(user.username ?? ""); }}
                  className="text-xs text-primary hover:underline mb-2 inline-block"
                >
                  Set a public username →
                </button>
              )}
              {user.bio && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{user.bio}</p>
              )}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 truncate max-w-[200px] sm:max-w-none"><Mail className="h-3 w-3 shrink-0" /> {user.email}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3 shrink-0" /> Joined {memberSince}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-4 text-center shrink-0">
              <div>
                <div className="text-2xl font-bold">{builds.length}</div>
                <div className="text-[10px] text-muted-foreground">Builds</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{user._count.reports}</div>
                <div className="text-[10px] text-muted-foreground">Reports</div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className="text-xs text-primary hover:underline transition-colors"
            >
              Edit profile
            </button>
            {user.image && (
              <button
                onClick={handleRemoveAvatar}
                disabled={avatarUploading}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Remove avatar
              </button>
            )}
            <div className="flex-1" />
            <button
              onClick={async () => {
                await fetch("/api/auth/signout", { method: "POST" });
                window.location.href = "/";
              }}
              className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg bg-muted/30 border border-border w-fit flex-wrap backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("builds")}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
              activeTab === "builds" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Builds ({builds.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
              activeTab === "reports" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Reports ({user._count.reports})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
              activeTab === "settings" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Settings
          </button>
        </div>

        {/* ========== SETTINGS TAB ========== */}
        {activeTab === "settings" && (
          <div className="space-y-4 max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Username */}
            <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" /> USERNAME
                </label>
                {!editingUsername && (
                  <button onClick={() => { setEditingUsername(true); setUsernameInput(user.username ?? ""); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                )}
              </div>
              {editingUsername ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      maxLength={24}
                      placeholder="your-handle"
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") handleSaveUsername(); if (e.key === "Escape") setEditingUsername(false); }}
                    />
                    <button onClick={handleSaveUsername} disabled={saving} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                    </button>
                    <button onClick={() => setEditingUsername(false)} className="px-3 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Cancel
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">3-24 characters, lowercase letters, numbers, ., _, -</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm">{user.username ? `@${user.username}` : <span className="text-muted-foreground italic">No username set</span>}</p>
                  {publicProfileHref && (
                    <Link href={publicProfileHref} className="text-xs text-primary hover:underline break-all">
                      void-forge.org{publicProfileHref}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Display Name */}
            <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" /> DISPLAY NAME
                </label>
                {!editingName && (
                  <button onClick={() => { setEditingName(true); setNameInput(user.name ?? ""); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                )}
              </div>
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={50}
                    placeholder="Your display name"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                  />
                  <button onClick={handleSaveName} disabled={saving} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                  </button>
                  <button onClick={() => setEditingName(false)} className="px-3 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-sm">{user.name || <span className="text-muted-foreground italic">No name set</span>}</p>
              )}
            </div>

            {/* Bio */}
            <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> BIO
                </label>
                {!editingBio && (
                  <button onClick={() => { setEditingBio(true); setBioInput(user.bio ?? ""); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                )}
              </div>
              {editingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    maxLength={300}
                    rows={3}
                    placeholder="Tell others about yourself..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-primary/50"
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{bioInput.length}/300</span>
                    <div className="flex gap-2">
                      <button onClick={handleSaveBio} disabled={saving} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                      </button>
                      <button onClick={() => setEditingBio(false)} className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{user.bio || <span className="text-muted-foreground italic">No bio set</span>}</p>
              )}
            </div>

            {/* Profile Picture */}
            <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-3">
                <Camera className="h-3.5 w-3.5" /> PROFILE PICTURE
              </label>
              <div className="flex items-center gap-4">
                {user.image ? (
                  <AvatarImage src={user.image} alt="" size={64} className="w-16 h-16 rounded-full border-2 border-border object-cover bg-background" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <span className="text-2xl font-bold text-muted-foreground">{user.name?.[0]?.toUpperCase() ?? "?"}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="block px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-50"
                  >
                    {avatarUploading ? "Uploading..." : "Upload new picture"}
                  </button>
                  <p className="text-[10px] text-muted-foreground">JPEG, PNG, WebP or GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

            {/* Account Info (read-only) */}
            <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-3">
                <Mail className="h-3.5 w-3.5" /> ACCOUNT
              </label>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="capitalize">{user.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span>{memberSince}</span>
                </div>
              </div>
            </div>

            {/* Email preferences */}
            <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-3">
                <Mail className="h-3.5 w-3.5" /> EMAIL PREFERENCES
              </label>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Newsletters</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Occasional product news from news@void-forge.org. Report status and account
                    emails from support are separate and always sent when needed.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={user.newsletterOptIn !== false}
                  disabled={saving}
                  onClick={() => handleNewsletterToggle(!(user.newsletterOptIn ?? true))}
                  className={cn(
                    "relative shrink-0 w-11 h-6 rounded-full transition-colors disabled:opacity-50",
                    user.newsletterOptIn !== false ? "bg-primary" : "bg-muted border border-border",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform",
                      user.newsletterOptIn !== false && "translate-x-5",
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
              <label className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5" /> DANGER ZONE
              </label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Permanently delete your account, cloud builds, votes, and linked Discord connection.
                Local builds in this browser are not removed. This cannot be undone.
              </p>
              {!deleteAccountOpen ? (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteAccountOpen(true);
                    setDeleteConfirmInput("");
                    setDeleteError(null);
                  }}
                  className="px-3 py-2 text-xs rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                >
                  Delete account…
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-muted-foreground">
                    Type <span className="font-mono text-foreground">{user.username || user.email}</span> to confirm:
                  </p>
                  <input
                    value={deleteConfirmInput}
                    onChange={(e) => setDeleteConfirmInput(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-red-500/50"
                    placeholder={user.username || user.email || "confirm"}
                    autoFocus
                  />
                  {deleteError && <p className="text-xs text-red-400">{deleteError}</p>}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={deletingAccount || !deleteConfirmInput.trim()}
                      onClick={async () => {
                        setDeletingAccount(true);
                        setDeleteError(null);
                        try {
                          const res = await fetch("/api/auth/account", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ confirm: deleteConfirmInput.trim() }),
                          });
                          const data = await res.json().catch(() => ({}));
                          if (!res.ok) {
                            setDeleteError(typeof data.error === "string" ? data.error : "Delete failed");
                            return;
                          }
                          window.location.href = "/";
                        } catch {
                          setDeleteError("Network error. Try again.");
                        } finally {
                          setDeletingAccount(false);
                        }
                      }}
                      className="px-3 py-2 text-xs rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 font-medium transition-colors"
                    >
                      {deletingAccount ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Delete forever"}
                    </button>
                    <button
                      type="button"
                      disabled={deletingAccount}
                      onClick={() => {
                        setDeleteAccountOpen(false);
                        setDeleteConfirmInput("");
                        setDeleteError(null);
                      }}
                      className="px-3 py-2 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== REPORTS TAB ========== */}
        {activeTab === "reports" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl">
            <p className="text-xs text-muted-foreground">
              Status updates and moderator replies for reports you filed while signed in appear here (no email unless a mod chooses to send one). Anonymous reports are not listed.
            </p>
            {reportsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-lg bg-muted animate-pulse border border-border/50" />
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed border-border bg-card/30">
                <Flag className="h-10 w-10 text-muted-foreground/40 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">No reports yet, or none tied to this account.</p>
                <Link
                  href="/report-issue"
                  className="text-xs text-primary hover:underline"
                >
                  Submit a data issue
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {reports.map((r) => {
                  const statusCfg =
                    r.status === "resolved"
                      ? { label: "Resolved", Icon: CheckCircle2, className: "text-green-400 bg-green-500/10 border-green-500/25" }
                      : r.status === "wontfix"
                        ? { label: "Won't fix", Icon: Ban, className: "text-zinc-400 bg-zinc-500/10 border-zinc-500/25" }
                        : { label: "Open", Icon: CircleDot, className: "text-amber-400 bg-amber-500/10 border-amber-500/25" };
                  const SIcon = statusCfg.Icon;
                  return (
                    <li
                      key={r.id}
                      className="rounded-lg border border-border bg-card/60 p-4 flex flex-col sm:flex-row sm:items-start gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm truncate">{r.itemName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground uppercase">
                            {r.itemType}
                          </span>
                        </div>
                        {r.comment ? (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.comment}</p>
                        ) : null}
                        {r.adminReply ? (
                          <div className="mt-2 rounded-md border border-sky-500/20 bg-sky-500/5 px-2.5 py-2">
                            <p className="text-[10px] font-semibold text-sky-400/80 uppercase mb-0.5">
                              Moderator reply
                            </p>
                            <p className="text-xs text-foreground/90 whitespace-pre-wrap">{r.adminReply}</p>
                          </div>
                        ) : null}
                        <p className="text-[10px] text-muted-foreground mt-2">
                          Submitted {new Date(r.createdAt).toLocaleString()}
                          {r.updatedAt !== r.createdAt && (
                            <> · Updated {new Date(r.updatedAt).toLocaleString()}</>
                          )}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 shrink-0 text-[10px] font-semibold px-2 py-1 rounded-md border",
                          statusCfg.className
                        )}
                      >
                        <SIcon className="h-3 w-3" />
                        {statusCfg.label}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* ========== BUILDS TAB ========== */}
        {activeTab === "builds" && (<>
          {/* Build Type Filter */}
          <div className="flex gap-2 mb-6 flex-wrap animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${filter === "all" ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              All ({builds.length})
            </button>
            {["weapon", "warframe", "companion", "modular", "archwing", "railjack", "loadout"].map((t) => {
              const Icon = typeIcons[t] ?? Crosshair;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${filter === t ? `${typeColors[t]} bg-white/5` : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon className="h-3 w-3" />
                  {t.charAt(0).toUpperCase() + t.slice(1)} ({buildCounts[t] || 0})
                </button>
              );
            })}
          </div>

          {/* Builds List */}
          {buildsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-muted animate-pulse border border-border/50" />
              ))}
            </div>
          ) : filteredBuilds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-2xl border border-dashed border-border bg-card/30 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-10 w-10 text-primary/40" />
              </div>
              <h2 className="text-xl font-bold mb-2">Your Arsenal is Empty</h2>
              <p className="text-muted-foreground text-sm max-w-sm mb-8">
                {builds.length === 0
                  ? "You haven't saved any builds to your account yet. Head over to the builder to start experimenting."
                  : `No saved builds found for the "${filter}" category.`}
              </p>
              {builds.length === 0 && (
                <Link
                  href="/weapon-builder"
                  className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
                >
                  Create your first build
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredBuilds.map((build) => {
                const Icon = typeIcons[build.type] ?? Crosshair;
                const colorClass = typeColors[build.type] ?? "text-muted-foreground border-border";
                return (
                  <div
                    key={build.id}
                    className="flex items-stretch rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-primary/35 group"
                  >
                    <Link
                      href={buildOpenUrl(build.type, build.id)}
                      className="flex flex-1 items-center gap-3 p-4 min-w-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
                    >
                      <div className={`p-2 rounded-lg bg-white/5 shrink-0 ${colorClass.split(" ")[0]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate group-hover:text-primary transition-colors flex items-center gap-2">
                          {build.name}
                          {build.isPublic ? (
                            <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                              Public
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border shrink-0">
                              Private
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {build.type} • {new Date(build.updatedAt).toLocaleDateString()} {new Date(build.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {(build.upvoteCount ?? 0) > 0 && ` • ${build.upvoteCount} upvotes`}
                        </div>
                        <div className="text-[10px] text-primary/80 mt-1">Open in builder</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 self-center" aria-hidden />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleTogglePublic(build)}
                      title={build.isPublic ? "Remove from community listing" : "List in Community Builds"}
                      className="px-3 shrink-0 border-l border-border flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-[10px] font-medium"
                    >
                      {build.isPublic ? "Unlist" : "List"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(build.id)}
                      title="Delete build"
                      className="px-3 shrink-0 border-l border-border flex items-center justify-center hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>)}
      </div>

      <AvatarCropDialog
        open={avatarCropOpen}
        imageSrc={avatarCropSrc}
        onOpenChange={(open) => {
          if (!open) closeAvatarCrop();
          else setAvatarCropOpen(true);
        }}
        onConfirm={handleAvatarUpload}
        uploading={avatarUploading}
      />
    </PageShell>
  );
}
