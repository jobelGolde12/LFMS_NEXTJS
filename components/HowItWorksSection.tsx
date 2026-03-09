import { UserPlus, Database, Cpu, Bell } from "lucide-react";
import StepCard from "./StepCard";

const steps = [
  {
    icon: UserPlus,
    title: "Report Item",
    description: "User reports a lost or found item with detailed description, photos, and location.",
    step: 1
  },
  {
    icon: Database,
    title: "Store Details",
    description: "System securely stores all item details in a centralized, organized database.",
    step: 2
  },
  {
    icon: Cpu,
    title: "Smart Matching",
    description: "Matching engine compares item attributes across lost and found items.",
    step: 3
  },
  {
    icon: Bell,
    title: "Get Notified",
    description: "Users receive instant notifications about possible matches.",
    step: 4
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            How The{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              System Works
            </span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Simple, efficient process to reunite lost items with their owners
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 hidden lg:block" />
          
          <div className="grid lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
