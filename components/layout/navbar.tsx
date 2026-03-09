"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { User } from "@/types";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/lost-items") || pathname.startsWith("/found-items") || pathname.startsWith("/matches") || pathname.startsWith("/claims") || pathname.startsWith("/report-");
  const dashboardLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Report Lost", href: "/report-lost" },
    { name: "Report Found", href: "/report-found" },
    { name: "Lost Items", href: "/lost-items" },
    { name: "Found Items", href: "/found-items" },
    { name: "Matches", href: "/matches" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200 dark:bg-zinc-900/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-emerald-600"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>LostFound</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user.name}
                </span>
                {user.role === "admin" && (
                  <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                    Admin
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                <div className="py-2 text-zinc-600 dark:text-zinc-300">
                  {user.name}
                  {user.role === "admin" && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Logout
                </button>
                {isDashboard && (
                  <div className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
                    {dashboardLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-2 text-zinc-600 dark:text-zinc-300"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-zinc-600 dark:text-zinc-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-emerald-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
