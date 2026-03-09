import { getUserCount } from "./user";
import { getItemCountByStatus, getRecentItems } from "./item";
import { getMatchCount } from "@/lib/matching-engine";
import { DashboardStats } from "@/types";

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
