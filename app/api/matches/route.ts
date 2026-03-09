import { NextRequest, NextResponse } from "next/server";
import { runMatchingEngine, getMatches } from "@/lib/matching-engine";
import { requireAdmin, requireAuth } from "@/lib/auth/permissions";

export async function POST() {
  try {
    await requireAdmin();

    const matches = await runMatchingEngine();

    return NextResponse.json({
      message: "Matching engine ran successfully",
      matchesFound: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Run matching engine error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = await getMatches({ status, limit, offset });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get matches error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
