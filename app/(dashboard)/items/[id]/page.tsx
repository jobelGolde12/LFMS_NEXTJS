import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/utils/session";
import { getItemById } from "@/lib/services/item";
import { Badge } from "@/components/ui";
import { ClaimButton } from "@/components/items";
import { formatDate } from "@/lib/utils";

interface ItemDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailsPage({ params }: ItemDetailsPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Item not found</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">The requested item does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{item.title}</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {item.status === "lost" ? "Lost item report details" : "Found item report details"}
          </p>
        </div>
        <Badge variant={item.status === "lost" ? "danger" : "success"}>{item.status}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="relative h-80 bg-zinc-100 dark:bg-zinc-800">
            {item.image_url ? (
              <Image src={item.image_url} alt={item.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-16 w-16 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Item Information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <dt className="text-zinc-500 dark:text-zinc-400">Category</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">{item.category}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <dt className="text-zinc-500 dark:text-zinc-400">Location</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">{item.location}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <dt className="text-zinc-500 dark:text-zinc-400">Date Reported</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">{formatDate(item.date_reported)}</dd>
            </div>
            {item.color && (
              <div className="flex justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <dt className="text-zinc-500 dark:text-zinc-400">Color</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{item.color}</dd>
              </div>
            )}
            {item.brand && (
              <div className="flex justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <dt className="text-zinc-500 dark:text-zinc-400">Brand</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{item.brand}</dd>
              </div>
            )}
            {item.reporter_name && (
              <div className="flex justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <dt className="text-zinc-500 dark:text-zinc-400">Reported By</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{item.reporter_name}</dd>
              </div>
            )}
          </dl>

          {item.description && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Description</h3>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300">{item.description}</p>
            </div>
          )}

          {item.status === "found" && (
            <div className="mt-6">
              <ClaimButton itemId={item.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
