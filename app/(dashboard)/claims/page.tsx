import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, requireAdmin } from "@/lib/utils/session";
import { getAllClaims } from "@/lib/services/claim";
import { Badge } from "@/components/ui";

export default async function ClaimsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  const { claims, total } = await getAllClaims();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Claims Management
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          {total} claims to review
        </p>
      </div>

      {claims.length === 0 ? (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
            No claims yet
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Claims will appear here when users request their items
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Item
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Claimer
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {claim.item?.title || "Unknown Item"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="text-zinc-900 dark:text-white">
                          {claim.user?.name || "Unknown User"}
                        </span>
                        <p className="text-sm text-zinc-500">
                          {claim.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          claim.status === "approved"
                            ? "success"
                            : claim.status === "rejected"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                      {new Date(claim.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {claim.status === "pending" && (
                          <>
                            <form
                              action={`/api/claims/${claim.id}`}
                              method="POST"
                            >
                              <input type="hidden" name="status" value="approved" />
                              <button
                                type="submit"
                                className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
                              >
                                Approve
                              </button>
                            </form>
                            <form
                              action={`/api/claims/${claim.id}`}
                              method="POST"
                            >
                              <input type="hidden" name="status" value="rejected" />
                              <button
                                type="submit"
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                              >
                                Reject
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
