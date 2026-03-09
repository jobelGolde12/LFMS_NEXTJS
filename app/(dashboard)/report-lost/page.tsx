import { ItemForm } from "@/components/forms";

export default function ReportLostPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
        Report Lost Item
      </h1>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6">
        <ItemForm status="lost" />
      </div>
    </div>
  );
}
