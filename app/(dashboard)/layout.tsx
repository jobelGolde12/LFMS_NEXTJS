import { getSession } from "@/lib/utils/session";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar user={session} />
      <div className="flex">
        <Sidebar user={session} />
        <main className="ml-0 flex-1 overflow-y-auto p-6 md:ml-64 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
