export default function MatchesLoading() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}
