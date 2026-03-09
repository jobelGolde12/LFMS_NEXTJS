import { getSession } from "@/lib/utils/session";
import { redirect } from "next/navigation";
import { AdminAnalyticsChart, DashboardCard, RecentReportsTable } from "@/components/dashboard";
import { getDashboardStats, getReportTrend } from "@/lib/services/dashboard";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [stats, reportTrend] = await Promise.all([getDashboardStats(), getReportTrend(90)]);
  const recentReports = JSON.parse(JSON.stringify(stats.recentReports));
  const trend = JSON.parse(JSON.stringify(reportTrend));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Welcome back, {session.name}
        </p>
      </div>

      {session.role === "admin" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Users"
              value={stats.totalUsers}
              className="from-sky-50 via-white to-blue-100/70 dark:from-sky-950/40 dark:via-zinc-900 dark:to-blue-950/40"
              icon={
                <svg className="h-6 w-6 text-sky-700 dark:text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
            <DashboardCard
              title="Lost Items"
              value={stats.totalLostItems}
              className="from-rose-50 via-white to-orange-100/70 dark:from-rose-950/40 dark:via-zinc-900 dark:to-orange-950/40"
              icon={
                <svg className="h-6 w-6 text-rose-700 dark:text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
            <DashboardCard
              title="Found Items"
              value={stats.totalFoundItems}
              className="from-emerald-50 via-white to-teal-100/70 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-teal-950/40"
              icon={
                <svg className="h-6 w-6 text-emerald-700 dark:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <DashboardCard
              title="Matches"
              value={stats.totalMatchedItems}
              className="from-amber-50 via-white to-lime-100/70 dark:from-amber-950/40 dark:via-zinc-900 dark:to-lime-950/40"
              icon={
                <svg className="h-6 w-6 text-amber-700 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
          <AdminAnalyticsChart trend={trend} />
        </>
      )}

      <RecentReportsTable items={recentReports} />
    </div>
  );
}
