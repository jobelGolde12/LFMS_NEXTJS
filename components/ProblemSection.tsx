import { BookOpen, MessageCircle, Clock, FileText } from "lucide-react";
import ProblemCard from "./ProblemCard";

const problems = [
  {
    icon: BookOpen,
    title: "Manual Logbooks",
    description: "Traditional paper-based logbooks are easily damaged, lost, or difficult to search through.",
    color: "emerald"
  },
  {
    icon: MessageCircle,
    title: "Social Media Confusion",
    description: "Lost items posted on social media get buried under new posts and are hard to track.",
    color: "blue"
  },
  {
    icon: Clock,
    title: "Slow Item Recovery",
    description: "Without a centralized system, matching lost items with found ones takes days or weeks.",
    color: "purple"
  },
  {
    icon: FileText,
    title: "Unorganized Records",
    description: "No standardized way to record item details, making it impossible to match items effectively.",
    color: "orange"
  }
];

export default function ProblemSection() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            The Problem With Traditional{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Lost & Found Systems
            </span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Current methods are inefficient, leading to lost items never being returned to their owners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <ProblemCard key={index} {...problem} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
