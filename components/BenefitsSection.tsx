import { Clock, Share2, Search, Database } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Faster Item Recovery",
    description: "Reduce the time it takes to reunite lost items with their owners by up to 80%",
    stat: "80% Faster"
  },
  {
    icon: Share2,
    title: "Centralized Reporting",
    description: "All lost and found reports in one place, accessible to everyone",
    stat: "100% Centralized"
  },
  {
    icon: Search,
    title: "Easy Item Searching",
    description: "Powerful search and filter capabilities to find items instantly",
    stat: "Real-time Search"
  },
  {
    icon: Database,
    title: "Better Organization",
    description: "Structured database with categories, tags, and detailed descriptions",
    stat: "Organized Data"
  }
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-900" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Benefits for{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Students & Staff
            </span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Making campus life easier with efficient lost and found management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-bl-full" />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                  {benefit.description}
                </p>
                
                <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
                  {benefit.stat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
