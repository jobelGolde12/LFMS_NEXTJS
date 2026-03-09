import { redirect } from "next/navigation";
import { DashboardCard, DashboardHeader } from "@/components/dashboard";
import { requireAdmin } from "@/lib/auth/permissions";
import { getDashboardStats } from "@/lib/services/dashboard";
import { getClaimCountByStatus } from "@/lib/services/claim";

export default async function AdminDashboardPage() {
  await requireAdmin().catch(() => redirect("/dashboard"));

  const [stats, pendingClaims] = await Promise.all([
    getDashboardStats(),
    getClaimCountByStatus("pending"),
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="System analytics and moderation overview."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <DashboardCard title="Total Users" value={stats.totalUsers} />
        <DashboardCard title="Total Lost Items" value={stats.totalLostItems} />
        <DashboardCard title="Total Found Items" value={stats.totalFoundItems} />
        <DashboardCard title="Total Matches" value={stats.totalMatchedItems} />
        <DashboardCard title="Pending Claims" value={pendingClaims} />
      </div>
    </div>
  );
}
