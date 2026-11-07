import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth/admin";
import { sendReportStatusEmail } from "@/lib/auth/email";
import { logServerError } from "@/lib/log-server-error";
import { removeReportScreenshotFile } from "@/lib/reports/report-screenshot-files";
import { withSqliteSchemaRetry as withReportSchemaRetry } from "@/lib/sqlite-schema-repair";

const ADMIN_REPLY_MAX = 4_000;

// PATCH /api/reports/[id] — admin/mod only: update status and optional reply
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  let body: { status?: string; adminReply?: string; notifyByEmail?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: { status?: string; adminReply?: string } = {};

  const VALID_STATUSES = ["open", "resolved", "wontfix"];
  if (body.status) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }
    updates.status = body.status;
  }

  if (body.adminReply !== undefined) {
    if (typeof body.adminReply !== "string") {
      return NextResponse.json({ error: "adminReply must be a string" }, { status: 400 });
    }
    const trimmed = body.adminReply.trim();
    if (trimmed.length > ADMIN_REPLY_MAX) {
      return NextResponse.json(
        { error: `Reply must be ${ADMIN_REPLY_MAX} characters or less` },
        { status: 400 },
      );
    }
    updates.adminReply = trimmed;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const existing = await withReportSchemaRetry(() =>
      prisma.report.findUnique({
        where: { id },
        include: { user: { select: { email: true } } },
      }),
    );
    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const report = await withReportSchemaRetry(() =>
      prisma.report.update({
        where: { id },
        data: updates,
      }),
    );

    // Email only when the mod explicitly opts in — status + reply always show on Profile → Reports.
    const newStatus = updates.status as string | undefined;
    const closing = newStatus === "resolved" || newStatus === "wontfix";
    const wasOpen = existing.status === "open";
    const wantsEmail = body.notifyByEmail === true;

    if (wantsEmail && closing && wasOpen && existing.userId && existing.user?.email) {
      try {
        await sendReportStatusEmail({
          to: existing.user.email,
          reporterName: existing.reporterName || "Tenno",
          status: newStatus as "resolved" | "wontfix",
          itemName: existing.itemName,
          itemType: existing.itemType,
          reportId: report.id,
          adminReply: report.adminReply,
        });
      } catch (e) {
        logServerError("[reports] Status email failed", e);
      }
    }

    return NextResponse.json(report);
  } catch (e) {
    logServerError("PATCH /api/reports/[id]", e);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

// DELETE /api/reports/[id] — admin/mod only
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const existing = await withReportSchemaRetry(() =>
      prisma.report.findUnique({
        where: { id },
        select: { screenshots: true },
      }),
    );
    if (existing?.screenshots) {
      try {
        const urls = JSON.parse(existing.screenshots);
        if (Array.isArray(urls)) {
          for (const u of urls) {
            if (typeof u === "string" && u.startsWith("/api/uploads/reports/")) {
              const filename = u.replace("/api/uploads/reports/", "").split("?")[0];
              await removeReportScreenshotFile(filename);
            }
          }
        }
      } catch {
        // ignore JSON parse error
      }
    }
    await prisma.report.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
}
