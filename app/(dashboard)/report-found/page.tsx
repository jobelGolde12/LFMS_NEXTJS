import { ItemForm } from "@/components/forms";
import { DashboardHeader } from "@/components/dashboard";

export default function ReportFoundPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <DashboardHeader
        title="Report Found Item"
        subtitle="If you found an item on campus, report it here so the rightful owner can locate it."
      />
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6">
        <ItemForm status="found" />
      </div>
    </div>
  );
}
