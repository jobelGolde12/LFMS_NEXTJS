"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LF</span>
            </div>
            <span className="font-bold text-xl text-zinc-900 dark:text-white">
              SorSU <span className="text-emerald-600">Lost & Found</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#home" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
              How It Works
            </Link>
            <Link href="#about" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-600 dark:text-zinc-400">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white">
                Register
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            ) : (
              <Menu className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="flex flex-col space-y-3">
              <Link href="#home" className="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600" onClick={() => setIsOpen(false)}>Home</Link>
              <Link href="#features" className="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600" onClick={() => setIsOpen(false)}>Features</Link>
              <Link href="#how-it-works" className="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600" onClick={() => setIsOpen(false)}>How It Works</Link>
              <Link href="#about" className="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600" onClick={() => setIsOpen(false)}>About</Link>
              <Link href="#contact" className="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600" onClick={() => setIsOpen(false)}>Contact</Link>
              <div className="pt-3 flex flex-col space-y-2">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white">Register</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
