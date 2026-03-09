import { NextRequest, NextResponse } from "next/server";
import { DEV_FALLBACK_SESSION_SECRET, SESSION_COOKIE } from "@/lib/auth/constants";

const AUTH_PAGES = new Set(["/login", "/register"]);

const USER_PAGE_PREFIXES = [
  "/dashboard",
  "/report-lost",
  "/report-found",
  "/lost-items",
  "/found-items",
  "/matches",
  "/profile",
  "/items",
];

const ADMIN_PAGE_PREFIXES = ["/dashboard/admin", "/claims"];

function requiresProtectedPage(pathname: string): boolean {
  return USER_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function requiresAdminPage(pathname: string): boolean {
  return ADMIN_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

async function verifyToken(token: string): Promise<{ id: string; role: string } | null> {
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const secret = process.env.SESSION_SECRET || DEV_FALLBACK_SESSION_SECRET;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const expected = Array.from(new Uint8Array(signatureBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  if (expected !== signature) return null;

  try {
    const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const payloadJson = atob(padded);
    const payload = JSON.parse(payloadJson) as { id: string; role: string };
    if (!payload?.id || !payload?.role) return null;
    return payload;
  } catch {
    return null;
  }
}

function unauthorizedApi(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname === "/") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  const isAuthenticated = Boolean(session);

  if (AUTH_PAGES.has(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    const needsAuth =
      pathname.startsWith("/api/items") ||
      pathname.startsWith("/api/claims") ||
      pathname.startsWith("/api/matches") ||
      pathname.startsWith("/api/dashboard") ||
      pathname.startsWith("/api/admin");

    if (needsAuth && !isAuthenticated) {
      return unauthorizedApi("Unauthorized", 401);
    }

    const adminApi =
      pathname.startsWith("/api/admin") ||
      pathname.startsWith("/api/dashboard") ||
      (pathname.startsWith("/api/claims/") && request.method !== "GET");

    if (adminApi && session?.role !== "admin") {
      return unauthorizedApi("Forbidden", 403);
    }

    return NextResponse.next();
  }

  const adminPage = requiresAdminPage(pathname);
  const userPage = requiresProtectedPage(pathname);

  if ((adminPage || userPage) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (adminPage && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard?error=403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/report-lost",
    "/report-found",
    "/lost-items/:path*",
    "/found-items/:path*",
    "/matches/:path*",
    "/profile/:path*",
    "/claims/:path*",
    "/items/:path*",
    "/api/:path*",
    "/login",
    "/register",
  ],
};
