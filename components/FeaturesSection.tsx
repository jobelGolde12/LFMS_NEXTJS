import { FileText, Search, Repeat, Shield, Users, Database } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Lost Item Reporting",
    description: "Detailed reporting with photos, categories, and location tracking",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Search,
    title: "Found Item Reporting",
    description: "Quick and easy reporting for found items with verification",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Repeat,
    title: "Automatic Item Matching",
    description: "Smart algorithm matches items based on multiple attributes",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "Item Claim Requests",
    description: "Secure claim process with verification questions",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: Users,
    title: "Admin Verification",
    description: "Admin oversight to ensure legitimate claims and returns",
    color: "from-pink-500 to-pink-600"
  },
  {
    icon: Database,
    title: "Secure User Accounts",
    description: "Protected profiles with role-based access control",
    color: "from-indigo-500 to-indigo-600"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Key{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to manage lost and found items efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-zinc-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-zinc-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
