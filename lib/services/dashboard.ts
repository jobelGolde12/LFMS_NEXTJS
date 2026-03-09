import { getUserCount } from "./user";
import { getItemCountByStatus, getRecentItems } from "./item";
import { getMatchCount } from "@/lib/matching-engine";
import { DashboardStats } from "@/types";
import { db } from "@/lib/db";

export interface ReportTrendPoint {
  date: string;
  lost: number;
  found: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalUsers,
    totalLostItems,
    totalFoundItems,
    totalMatchedItems,
    recentReports,
  ] = await Promise.all([
    getUserCount(),
    getItemCountByStatus("lost"),
    getItemCountByStatus("found"),
    getMatchCount(),
    getRecentItems(10),
  ]);

  return {
    totalUsers,
    totalLostItems,
    totalFoundItems,
    totalMatchedItems,
    recentReports,
  };
}

export async function getReportTrend(days: number = 90): Promise<ReportTrendPoint[]> {
  const rows = await db.execute({
    sql: `SELECT date(date_reported) as date,
                 SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) as lost,
                 SUM(CASE WHEN status = 'found' THEN 1 ELSE 0 END) as found
          FROM items
          WHERE date(date_reported) >= date('now', ?)
          GROUP BY date(date_reported)
          ORDER BY date(date_reported) ASC`,
    args: [`-${days} days`],
  });

  const counts = new Map<string, { lost: number; found: number }>();
  for (const row of rows.rows) {
    const typedRow = row as unknown as { date: string; lost: number; found: number };
    const date = String(typedRow.date);
    counts.set(date, {
      lost: Number(typedRow.lost || 0),
      found: Number(typedRow.found || 0),
    });
  }

  const series: ReportTrendPoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const date = day.toISOString().slice(0, 10);
    const entry = counts.get(date) || { lost: 0, found: 0 };
    series.push({ date, lost: entry.lost, found: entry.found });
  }

  return series;
}
