import { LucideIcon } from "lucide-react";

interface ProblemCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  index: number;
}

const colorClasses: Record<string, string> = {
  emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
};

export default function ProblemCard({ icon: Icon, title, description, color, index }: ProblemCardProps) {
  return (
    <div 
      className="group relative bg-gray-50 dark:bg-zinc-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {description}
      </p>
    </div>
  );
}
