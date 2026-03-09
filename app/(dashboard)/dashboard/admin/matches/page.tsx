import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard";
import { requireAdmin } from "@/lib/auth/permissions";
import { getMatches } from "@/lib/matching-engine";

export default async function AdminMatchesPage() {
  await requireAdmin().catch(() => redirect("/dashboard"));
  const { matches } = await getMatches({ limit: 100, offset: 0 });

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardHeader title="Matches Management" subtitle="Review and moderate detected matches." />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Lost Item</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Found Item</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Score</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{match.lost_item?.title || "Unknown"}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{match.found_item?.title || "Unknown"}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{match.score}%</td>
                <td className="px-4 py-3 capitalize text-zinc-700 dark:text-zinc-300">{match.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
