import { NextRequest, NextResponse } from "next/server";
import { getClaimById, updateClaimStatus } from "@/lib/services/claim";
import { requireAdmin } from "@/lib/utils/session";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const claim = await getClaimById(id);

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    await updateClaimStatus(id, status);

    return NextResponse.json({ message: "Claim status updated" });
  } catch (error) {
    console.error("Update claim error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
