import Link from "next/link";
import { ItemCard } from "@/components/items";
import { getItemsByStatus } from "@/lib/services/item";
import { CATEGORIES, COLORS } from "@/types";
import { DashboardHeader, DateFilter, FilterDropdown, SearchBar } from "@/components/dashboard";

interface FoundItemsPageProps {
  searchParams: Promise<{ search?: string; category?: string; color?: string; date?: string }>;
}

export default async function FoundItemsPage({ searchParams }: FoundItemsPageProps) {
  const params = await searchParams;
  const { items, total } = await getItemsByStatus("found", {
    search: params.search,
    category: params.category,
    color: params.color,
    date: params.date,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader
        title="Found Items"
        subtitle="Check items that have been found around the campus."
        action={(
          <Link
            href="/dashboard/report-found"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-50 px-4 py-2 font-medium text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Report Found Item
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
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{total} items found and reported</p>
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
            No found items
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Be the first to report a found item
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} showActions showClaimButton />
          ))}
        </div>
      )}
    </div>
  );
}
