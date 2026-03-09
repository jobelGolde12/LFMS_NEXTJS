import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600 relative overflow-hidden" id="contact">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Start Reporting Lost or Found Items Today
        </h2>
        
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Join hundreds of students and staff who are already using SorSU Lost & Found to recover their belongings.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all group">
              Create Account
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 transition-all">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-sm">Free to use</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-sm">Secure platform</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-sm">24/7 access</span>
          </div>
        </div>
      </div>
    </section>
  );
}
