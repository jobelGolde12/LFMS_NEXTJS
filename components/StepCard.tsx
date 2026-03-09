import { LucideIcon } from "lucide-react";

interface StepCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step: number;
  index: number;
}

export default function StepCard({ icon: Icon, title, description, step, index }: StepCardProps) {
  return (
    <div className="relative group">
      <div 
        className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div className="relative inline-block">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {step}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
