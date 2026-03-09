import { Card } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function DashboardCard({ title, value, icon, trend, className }: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "group relative isolate overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white to-zinc-50/90 p-6 transition-all duration-300 dark:border-zinc-700/70 dark:from-zinc-900 dark:to-zinc-950",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/50 blur-2xl dark:bg-white/10" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="mt-3 text-4xl font-bold leading-none tracking-tight text-zinc-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                trend.value >= 0
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>

        {icon && (
          <div className="rounded-2xl border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/70">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
