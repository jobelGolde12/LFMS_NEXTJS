export default function LostItemsLoading() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}
