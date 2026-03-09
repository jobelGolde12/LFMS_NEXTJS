import { Card } from "@/components/ui";

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
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p className={`mt-2 text-sm ${
              trend.value >= 0 ? "text-emerald-600" : "text-red-600"
            }`}>
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
