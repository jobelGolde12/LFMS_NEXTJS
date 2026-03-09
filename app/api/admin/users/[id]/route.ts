import { NextRequest, NextResponse } from "next/server";
import { deleteUser } from "@/lib/services/user";
import { requireAdmin } from "@/lib/auth/permissions";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    if (admin.id === id) {
      return NextResponse.json({ error: "Admins cannot delete themselves" }, { status: 400 });
    }

    await deleteUser(id);
    return NextResponse.json({ message: "User deleted" });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
