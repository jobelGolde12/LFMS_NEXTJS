import { NextRequest, NextResponse } from "next/server";
import { getClaimById, updateClaimStatus } from "@/lib/services/claim";
import { requireAdmin } from "@/lib/utils/session";

async function handleUpdateStatus(request: NextRequest, claimId: string) {
  const contentType = request.headers.get("content-type") || "";
  let status = "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    status = String(body?.status || "");
  } else {
    const formData = await request.formData();
    status = String(formData.get("status") || "");
  }

  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  await updateClaimStatus(claimId, status as "pending" | "approved" | "rejected");
  return NextResponse.json({ message: "Claim status updated" });
}

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

    return handleUpdateStatus(request, id);
  } catch (error) {
    console.error("Update claim error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    return handleUpdateStatus(request, id);
  } catch (error) {
    console.error("Update claim error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
