import { NextRequest, NextResponse } from "next/server";
import { runMatchingEngine, getMatches, getMatchById, updateMatchStatus } from "@/lib/matching-engine";
import { getSession, requireAdmin } from "@/lib/utils/session";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();

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
