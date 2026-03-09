import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAllItems } from "@/lib/services/item";

export default async function AdminReportsPage() {
  await requireAdmin().catch(() => redirect("/dashboard"));
  const { items } = await getAllItems({ limit: 100, offset: 0 });

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardHeader title="Reports" subtitle="Manage lost and found reports." />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Title</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Status</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Category</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Location</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Reported By</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{item.title}</td>
                <td className="px-4 py-3 text-zinc-700 capitalize dark:text-zinc-300">{item.status}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{item.category}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{item.location}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{item.reporter_name || "Unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
