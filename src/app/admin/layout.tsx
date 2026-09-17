import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { isUserBanned } from "@/lib/auth/admin";
import { AdminSubnav } from "@/components/admin-subnav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, bannedAt: true },
  });

  if (!user || isUserBanned(user) || (user.role !== "admin" && user.role !== "moderator")) {
    redirect("/");
  }

  const isFullAdmin = user.role === "admin";

  return (
    <div>
      <AdminSubnav isFullAdmin={isFullAdmin} />
      {children}
    </div>
  );
}
