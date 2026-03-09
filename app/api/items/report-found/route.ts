import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/permissions";
import { createItem } from "@/lib/services/item";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const title = String(body?.title || "").trim();
    const category = String(body?.category || "").trim();
    const location = String(body?.location || "").trim();
    const date_reported = String(body?.date_reported || "").trim();

    if (!title || !category || !location || !date_reported) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await createItem(session.id, {
      title,
      category,
      location,
      date_reported,
      status: "found",
      color: body?.color,
      brand: body?.brand,
      description: body?.description,
      image_url: body?.image_url,
    });

    return NextResponse.json({ item, message: "Found item reported" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
