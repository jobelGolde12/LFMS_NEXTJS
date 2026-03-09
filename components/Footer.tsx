import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LF</span>
              </div>
              <span className="font-bold text-xl">
                SorSU <span className="text-emerald-500">Lost & Found</span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              A smart lost and found management system for Sorsogon State University - Bulan Campus.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#about" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">About Us</Link></li>
              <li><Link href="#features" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">Features</Link></li>
              <li><Link href="#how-it-works" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">How It Works</Link></li>
              <li><Link href="#contact" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-zinc-400 text-sm">Sorsogon State University - Bulan Campus, Bulan, Sorsogon</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <a href="mailto:sorsu.lostfound@ssu.edu.ph" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">sorsu.lostfound@ssu.edu.ph</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <a href="tel:+63561234567" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm">+63 (56) 123 4567</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} SorSU Lost and Found Management System. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 text-sm transition-colors">Privacy</Link>
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 text-sm transition-colors">Terms</Link>
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 text-sm transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
