import Link from "next/link";
import { redirect } from "next/navigation";
import { MatchCard } from "@/components/items";
import { getMatches } from "@/lib/matching-engine";
import { DashboardHeader } from "@/components/dashboard";
import { getSession } from "@/lib/utils/session";

interface MatchesPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const { matches, total } = await getMatches({
    status: params.status,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader
        title="Possible Matches"
        subtitle="These items may match based on the system's similarity detection."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/dashboard/matches"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            !params.status
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          All
        </Link>
        <Link
          href="/dashboard/matches?status=suggested"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            params.status === "suggested"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          Suggested
        </Link>
        <Link
          href="/dashboard/matches?status=confirmed"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            params.status === "confirmed"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          Confirmed
        </Link>
        <Link
          href="/dashboard/matches?status=rejected"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            params.status === "rejected"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          Rejected
        </Link>
      </div>

      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">{total} potential matches found</p>

      {matches.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
            No matches found
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Try reporting more lost and found items
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
