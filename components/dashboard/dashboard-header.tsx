interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
