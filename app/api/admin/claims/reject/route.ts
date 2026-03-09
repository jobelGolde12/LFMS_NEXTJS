import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { updateClaimStatus } from "@/lib/services/claim";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const claimId = String(body?.claimId || "").trim();

    if (!claimId) {
      return NextResponse.json({ error: "claimId is required" }, { status: 400 });
    }

    await updateClaimStatus(claimId, "rejected");
    return NextResponse.json({ message: "Claim rejected" });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
