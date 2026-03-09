import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/services/user";
import { requireAdmin } from "@/lib/auth/permissions";

export async function GET() {
  try {
    await requireAdmin();
    const users = await getAllUsers();
    return NextResponse.json({ users, total: users.length });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
