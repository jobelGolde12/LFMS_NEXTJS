import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAllUsers } from "@/lib/services/user";

export default async function AdminUsersPage() {
  await requireAdmin().catch(() => redirect("/dashboard"));
  const users = await getAllUsers();

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardHeader title="Users" subtitle="View and manage registered users." />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Name</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Email</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Role</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-500">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{user.name}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{user.email}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 capitalize">{user.role}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
