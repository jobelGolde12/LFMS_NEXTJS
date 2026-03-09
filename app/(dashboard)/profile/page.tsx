import { redirect } from "next/navigation";
import { getSession } from "@/lib/utils/session";
import { DashboardHeader } from "@/components/dashboard";
import { Card } from "@/components/ui";
import { User, Mail, Shield, Edit2, MoreHorizontal } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Mock data for demonstration - replace with actual data
  const userStats = {
    joinedDate: "January 2024",
    lastActive: "2 hours ago",
    projects: 12,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DashboardHeader
        title="Profile"
        subtitle="Manage your account information and role details."
      />

      {/* Profile Header Card */}
      <Card className="relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50 p-8 shadow-xl dark:border-zinc-800/50 dark:from-zinc-900 dark:to-zinc-950">
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-2rem] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl dark:from-indigo-500/20 dark:to-purple-500/20" />
        <div className="absolute bottom-0 left-0 h-24 w-24 translate-x-[-1rem] translate-y-8 rounded-full bg-gradient-to-tr from-amber-500/10 to-orange-500/10 blur-2xl dark:from-amber-500/20 dark:to-orange-500/20" />
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar with gradient */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg ring-4 ring-white dark:ring-zinc-800">
                <span className="text-3xl font-bold text-white">
                  {session.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 dark:border-zinc-900" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {session.name}
              </h2>
              <div className="mt-1 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  Member since {userStats.joinedDate}
                </span>
                <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  {session.role}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800">
              <Edit2 className="h-4 w-4" />
            </button>
            <button className="rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: "Projects", value: userStats.projects },
            { label: "Tasks", value: "48" },
            { label: "Achievements", value: "12" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-200/50 bg-white/50 p-4 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/50"
            >
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Profile Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card className="rounded-2xl border border-zinc-200/50 bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="group flex items-center gap-4 rounded-xl p-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
              <div className="rounded-lg bg-indigo-100 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Email</div>
                <div className="font-medium text-zinc-900 dark:text-white">
                  {session.email}
                </div>
              </div>
            </div>
            
            <div className="group flex items-center gap-4 rounded-xl p-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
              <div className="rounded-lg bg-purple-100 p-2.5 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Role</div>
                <div className="font-medium capitalize text-zinc-900 dark:text-white">
                  {session.role}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Information */}
        <Card className="rounded-2xl border border-zinc-200/50 bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: "Updated profile", time: "2 hours ago" },
              { action: "Created new project", time: "1 day ago" },
              { action: "Completed task", time: "3 days ago" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl p-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              >
                <span className="text-sm text-zinc-900 dark:text-white">
                  {activity.action}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Account Settings Preview */}
      <Card className="rounded-2xl border border-zinc-200/50 bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Account Settings
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Two-factor authentication", status: "Enabled", color: "green" },
            { label: "Email notifications", status: "Weekly digest", color: "blue" },
            { label: "Session timeout", status: "30 minutes", color: "zinc" },
            { label: "Language", status: "English (US)", color: "zinc" },
          ].map((setting) => (
            <div
              key={setting.label}
              className="flex items-center justify-between rounded-xl border border-zinc-200/50 p-3 dark:border-zinc-800/50"
            >
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {setting.label}
              </span>
              <span
                className={`rounded-full bg-${setting.color}-100 px-2.5 py-0.5 text-xs font-medium text-${setting.color}-800 dark:bg-${setting.color}-900/30 dark:text-${setting.color}-400`}
              >
                {setting.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}