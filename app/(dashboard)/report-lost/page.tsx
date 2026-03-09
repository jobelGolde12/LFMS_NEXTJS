import { ItemForm } from "@/components/forms";
import { DashboardHeader } from "@/components/dashboard";

export default function ReportLostPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <DashboardHeader
        title="Report Lost Item"
        subtitle="Provide detailed information about the item you lost so the system can help find possible matches."
      />
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6">
        <ItemForm status="lost" />
      </div>
    </div>
  );
}
