import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/dashboard";
import { requireAdmin } from "@/lib/utils/session";

export async function GET() {
  try {
    await requireAdmin();

    const stats = await getDashboardStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
