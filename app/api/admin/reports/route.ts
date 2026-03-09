import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAllItems } from "@/lib/services/item";

export async function GET() {
  try {
    await requireAdmin();
    const result = await getAllItems({ limit: 200, offset: 0 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
