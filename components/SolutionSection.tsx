import { FileText, Search, Database, Zap } from "lucide-react";
import FeatureCard from "./FeatureCard";

const solutions = [
  {
    icon: FileText,
    title: "Report Lost Items",
    description: "Easily report lost items with detailed descriptions, photos, and location information.",
    color: "emerald"
  },
  {
    icon: Search,
    title: "Report Found Items",
    description: "Quickly log found items to help reunite them with their owners.",
    color: "blue"
  },
  {
    icon: Zap,
    title: "Smart Matching",
    description: "Our intelligent algorithm automatically matches lost items with found items based on attributes.",
    color: "purple"
  },
  {
    icon: Database,
    title: "Easy Search",
    description: "Powerful search and filter capabilities to find items quickly and efficiently.",
    color: "orange"
  }
];

export default function SolutionSection() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            A Smart Digital{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Lost and Found System
            </span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Centralized reporting, automated matching, and organized database for faster recovery of items.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <FeatureCard key={index} {...solution} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
