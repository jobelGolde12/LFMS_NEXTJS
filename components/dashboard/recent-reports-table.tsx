"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Item } from "@/types";

interface RecentReportsTableProps {
  items: Item[];
}

export function RecentReportsTable({ items }: RecentReportsTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "lost" | "found">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const deferredQuery = useDeferredValue(query);
  const deferredStatusFilter = useDeferredValue(statusFilter);
  const deferredCategoryFilter = useDeferredValue(categoryFilter);
  const loading =
    query !== deferredQuery ||
    statusFilter !== deferredStatusFilter ||
    categoryFilter !== deferredCategoryFilter;

  const categories = useMemo(() => {
    const unique = new Set(items.map((item) => item.category).filter(Boolean));
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.toLowerCase().trim();

    return items.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.location.toLowerCase().includes(normalizedQuery);

      const matchesStatus = deferredStatusFilter === "all" || item.status === deferredStatusFilter;
      const matchesCategory = deferredCategoryFilter === "all" || item.category === deferredCategoryFilter;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [items, deferredQuery, deferredStatusFilter, deferredCategoryFilter]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Recent Reports</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[640px]">
          <div className="relative sm:col-span-2">
            <input
              type="search"
              placeholder="Search item, category, or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-zinc-300 bg-white pl-10 pr-3 text-sm text-zinc-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "lost" | "found")}
              className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="all">All status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {filteredItems.length} result{filteredItems.length === 1 ? "" : "s"}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">Item</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td colSpan={4} className="px-4 py-4">
                    <div className="h-6 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                  </td>
                </tr>
              ))
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  No reports match your filters.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3">
                    <span className="font-medium text-zinc-900 dark:text-white">{item.title}</span>
                    <span className="ml-2 text-sm text-zinc-500">({item.category})</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "lost"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{item.location}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {new Date(item.date_reported).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
