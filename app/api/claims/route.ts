import { NextRequest, NextResponse } from "next/server";
import { createClaim, getAllClaims, getClaimsByUser, updateClaimStatus } from "@/lib/services/claim";
import { getSession, requireAdmin } from "@/lib/utils/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const claim = await createClaim(itemId, session.id);

    return NextResponse.json({
      message: "Claim submitted successfully",
      claim,
    });
  } catch (error) {
    console.error("Create claim error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "pending" | "approved" | "rejected" || undefined;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (session.role === "admin") {
      const result = await getAllClaims({ status, limit, offset });
      return NextResponse.json(result);
    }

    const claims = await getClaimsByUser(session.id);
    return NextResponse.json({ claims, total: claims.length });
  } catch (error) {
    console.error("Get claims error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
