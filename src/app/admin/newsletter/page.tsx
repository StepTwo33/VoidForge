"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { cn } from "@/lib/utils";
import { Mail, Loader2, Shield, Send, FlaskConical } from "lucide-react";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";
import {
  NEWSLETTER_DEFAULT_EYEBROW,
  buildNewsletterPreviewDocument,
} from "@/lib/auth/newsletter-template";

export default function AdminNewsletterPage() {
  const { confirm } = useConfirmDialog();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState(0);
  const [subject, setSubject] = useState("");
  const [eyebrow, setEyebrow] = useState(NEWSLETTER_DEFAULT_EYEBROW);
  const [preheader, setPreheader] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [testTo, setTestTo] = useState("");
  const [sending, setSending] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("https://frame-hub.com");

  const refreshCount = useCallback(() => {
    fetch("/api/admin/newsletter")
      .then((r) => {
        if (!r.ok) throw new Error("Forbidden");
        return r.json();
      })
      .then((data) => {
        setSubscribers(data.subscribers ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.role === "admin") {
          setAuthorized(true);
          refreshCount();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [refreshCount]);

  const composePayload = useCallback(() => {
    const payload: Record<string, string> = {
      subject: subject.trim(),
      body: body.trim(),
    };
    const e = eyebrow.trim();
    const p = preheader.trim();
    const label = ctaLabel.trim();
    const url = ctaUrl.trim();
    if (e) payload.eyebrow = e;
    if (p) payload.preheader = p;
    if (label) payload.ctaLabel = label;
    if (url) payload.ctaUrl = url;
    return payload;
  }, [subject, body, eyebrow, preheader, ctaLabel, ctaUrl]);

  const previewSrcDoc = useMemo(() => {
    const previewSubject = subject.trim() || "Newsletter subject";
    const previewBody =
      body.trim() ||
      "Your message will appear here.\n\nUse **bold**, *italic*, [links](https://frame-hub.com), and blank lines for paragraphs.";
    return buildNewsletterPreviewDocument(
      {
        subject: previewSubject,
        body: previewBody,
        eyebrow: eyebrow.trim() || NEWSLETTER_DEFAULT_EYEBROW,
        preheader: preheader.trim() || undefined,
        ctaLabel: ctaLabel.trim() || undefined,
        ctaUrl: ctaUrl.trim() || undefined,
      },
      {
        unsubscribeUrl: `${origin}/unsubscribe?token=preview`,
        profileUrl: `${origin}/profile`,
      },
    );
  }, [subject, body, eyebrow, preheader, ctaLabel, ctaUrl, origin]);

  const handleSendTest = async () => {
    setError(null);
    setResult(null);
    if (!subject.trim() || !body.trim()) {
      setError("Subject and body are required.");
      return;
    }
    if (!testTo.trim()) {
      setError("Enter a test recipient email.");
      return;
    }

    setTesting(true);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...composePayload(), testTo: testTo.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send test");
        return;
      }
      setResult(`Test sent to ${data.to}`);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setTesting(false);
    }
  };

  const handleSend = async () => {
    setError(null);
    setResult(null);
    if (!subject.trim() || !body.trim()) {
      setError("Subject and body are required.");
      return;
    }
    const ok = await confirm({
      title: `Send newsletter to ${subscribers} subscriber${subscribers === 1 ? "" : "s"}?`,
      description:
        "This emails every opted-in user from news@frame-hub.com. Transactional support mail is not used.",
      confirmLabel: "Send newsletter",
    });
    if (!ok) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...composePayload(), confirm: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send");
        return;
      }
      setResult(`Sent ${data.sent} of ${data.total}${data.failed ? ` (${data.failed} failed)` : ""}.`);
      setSubject("");
      setBody("");
      setPreheader("");
      setCtaLabel("");
      setCtaUrl("");
      setEyebrow(NEWSLETTER_DEFAULT_EYEBROW);
      refreshCount();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse mx-auto" />
        </div>
      </PageShell>
    );
  }

  if (!authorized) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-sm">Newsletter sends are restricted to admins.</p>
        </div>
      </PageShell>
    );
  }

  const fieldClass =
    "w-full h-9 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary/50";
  const labelClass = "text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 block";

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Mail className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Newsletter</h1>
            <p className="text-xs text-muted-foreground">
              Send from news@frame-hub.com · {subscribers} opted-in subscriber
              {subscribers === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div className="space-y-4 rounded-xl border border-border bg-card/60 p-4">
            <div>
              <label className={labelClass}>Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={120}
                placeholder="What's new on FrameHub"
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Eyebrow</label>
                <input
                  value={eyebrow}
                  onChange={(e) => setEyebrow(e.target.value)}
                  maxLength={80}
                  placeholder={NEWSLETTER_DEFAULT_EYEBROW}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Preheader</label>
                <input
                  value={preheader}
                  onChange={(e) => setPreheader(e.target.value)}
                  maxLength={200}
                  placeholder="Inbox preview snippet (optional)"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={20000}
                rows={12}
                placeholder={
                  "Write your update.\n\nSupports **bold**, *italic*, [links](https://…),\n## headings, and - bullet lists.\nBlank lines become paragraphs."
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background resize-y focus:outline-none focus:border-primary/50 font-mono"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                {body.length}/20000 · Markdown subset: **bold**, *italic*, links, ## headings, - lists
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background/40 p-3 space-y-2">
              <p className={cn(labelClass, "mb-0")}>Call to action (optional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  maxLength={60}
                  placeholder="Button label"
                  className={fieldClass}
                />
                <input
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  maxLength={500}
                  placeholder="https://frame-hub.com/…"
                  className={fieldClass}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Both fields required for a button. URL must use https://.
              </p>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
            {result && <p className="text-xs text-green-400">{result}</p>}

            <div className="rounded-lg border border-border bg-background/40 p-3 space-y-2">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase block">
                Send test to one address
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={testTo}
                  onChange={(e) => setTestTo(e.target.value)}
                  placeholder="you@example.com"
                  className={cn(fieldClass, "flex-1")}
                />
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={testing || sending}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg shrink-0",
                    "bg-amber-500/10 text-amber-300 border border-amber-500/25 hover:bg-amber-500/20",
                    "disabled:opacity-50 transition-colors",
                  )}
                >
                  {testing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FlaskConical className="h-3.5 w-3.5" />
                  )}
                  {testing ? "Sending test…" : "Send test"}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Uses the fields above. Subject is prefixed with [TEST]. Does not email subscribers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={sending || testing || subscribers === 0}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg",
                "bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25",
                "disabled:opacity-50 transition-colors",
              )}
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending…" : "Send newsletter"}
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-4 lg:sticky lg:top-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Preview</p>
              <p className="text-[10px] text-muted-foreground">Live · matches sent email</p>
            </div>
            <div className="rounded-lg border border-border overflow-hidden bg-[#0f172a]">
              <iframe
                title="Newsletter email preview"
                srcDoc={previewSrcDoc}
                sandbox=""
                className="w-full h-[min(70vh,720px)] border-0 bg-[#0f172a]"
              />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
