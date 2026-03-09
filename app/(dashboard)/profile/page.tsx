import { redirect } from "next/navigation";
import { getSession } from "@/lib/utils/session";
import { DashboardHeader } from "@/components/dashboard";
import { Card } from "@/components/ui";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <DashboardHeader
        title="Profile"
        subtitle="Manage your account information and role details."
      />

      <Card className="rounded-2xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
        <dl className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Name</dt>
            <dd className="font-medium text-zinc-900 dark:text-white">{session.name}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Email</dt>
            <dd className="font-medium text-zinc-900 dark:text-white">{session.email}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Role</dt>
            <dd className="font-medium capitalize text-zinc-900 dark:text-white">{session.role}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
