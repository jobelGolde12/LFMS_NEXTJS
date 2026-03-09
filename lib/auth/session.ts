import { cookies } from "next/headers";
import type { User } from "@/types";
import { DEV_FALLBACK_SESSION_SECRET, SESSION_COOKIE } from "./constants";

type SessionPayload = Pick<User, "id" | "name" | "email" | "role">;

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || DEV_FALLBACK_SESSION_SECRET;
}

function toBase64Url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

async function sign(payloadB64: string): Promise<string> {
  const { createHmac } = await import("crypto");
  return createHmac("sha256", getSessionSecret()).update(payloadB64).digest("hex");
}

async function encodeSession(payload: SessionPayload): Promise<string> {
  const payloadB64 = toBase64Url(JSON.stringify(payload));
  const signature = await sign(payloadB64);
  return `${payloadB64}.${signature}`;
}

async function decodeSession(token: string): Promise<SessionPayload | null> {
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expected = await sign(payloadB64);
  if (signature !== expected) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(payloadB64)) as SessionPayload;
    if (!parsed?.id || !parsed?.email || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setSession(user: User): Promise<void> {
  const cookieStore = await cookies();
  const token = await encodeSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await decodeSession(token);
  if (!payload) return null;

  return {
    ...payload,
    password: "",
    created_at: "",
  } as User;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function parseSessionToken(token: string): Promise<SessionPayload | null> {
  return decodeSession(token);
}
