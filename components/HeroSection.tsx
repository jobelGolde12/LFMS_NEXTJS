import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Bell, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-20 lg:py-28">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-800/20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Sorsogon State University - Bulan Campus</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
              Never Lose Your{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Belongings
              </span>{" "}
              Again
            </h1>
            
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto lg:mx-0">
              The SorSU Lost and Found Management System helps students, faculty, and staff easily report lost or found items and automatically suggests possible matches using intelligent rule-based matching.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/report-lost">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all">
                  Report Lost Item
                </Button>
              </Link>
              <Link href="/found-items">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                  Browse Found Items
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">500+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Items Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">98%</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Return Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">1000+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Users</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px] bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl backdrop-blur-sm border border-emerald-200 dark:border-zinc-800 p-8">
              <div className="absolute top-10 left-10 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">Lost Wallet</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">ID: John Doe</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-40 right-10 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-4 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">Match Found!</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">85% similarity</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-20 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-4 animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">Verified Return</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Admin approved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
