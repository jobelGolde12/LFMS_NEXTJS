import Link from "next/link";
import { ItemCard } from "@/components/items";
import { getItemsByStatus } from "@/lib/services/item";
import { CATEGORIES, COLORS } from "@/types";
import { DashboardHeader, DateFilter, FilterDropdown, SearchBar } from "@/components/dashboard";

interface LostItemsPageProps {
  searchParams: Promise<{ search?: string; category?: string; color?: string; date?: string }>;
}

export default async function LostItemsPage({ searchParams }: LostItemsPageProps) {
  const params = await searchParams;
  const { items, total } = await getItemsByStatus("lost", {
    search: params.search,
    category: params.category,
    color: params.color,
    date: params.date,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader
        title="Lost Items"
        subtitle="Browse all items reported as lost within the campus."
        action={(
          <Link
            href="/report-lost"
            className="inline-flex items-center justify-center rounded-xl bg-red-50 px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report Lost Item
          </Link>
        )}
      />

      <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <SearchBar placeholder="Search by item name, category, or location..." initialValue={params.search || ""} />
          <FilterDropdown
            paramName="category"
            defaultLabel="All categories"
            value={params.category}
            options={CATEGORIES.map((category) => ({ value: category, label: category }))}
          />
          <FilterDropdown
            paramName="color"
            defaultLabel="All colors"
            value={params.color}
            options={COLORS.map((color) => ({ value: color, label: color }))}
          />
          <DateFilter value={params.date || ""} />
        </div>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{total} items reported lost</p>
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
