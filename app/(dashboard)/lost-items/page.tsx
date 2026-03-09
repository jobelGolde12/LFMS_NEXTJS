import Link from "next/link";
import { ItemCard } from "@/components/items";
import { getItemsByStatus } from "@/lib/services/item";
import { CATEGORIES } from "@/types";

interface LostItemsPageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function LostItemsPage({ searchParams }: LostItemsPageProps) {
  const params = await searchParams;
  const { items, total } = await getItemsByStatus("lost", {
    search: params.search,
    category: params.category,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Lost Items
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            {total} items reported lost
          </p>
        </div>
        <Link
          href="/report-lost"
          className="inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Report Lost Item
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/lost-items"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            !params.category
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/lost-items?category=${category}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              params.category === category
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {category}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
            No lost items found
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} showActions />
          ))}
        </div>
      )}
    </div>
  );
}
