import { NextRequest, NextResponse } from "next/server";
import { createItem, getItemsByStatus, getAllItems, getItemById, deleteItem, getItemsByUserId } from "@/lib/services/item";
import { getSession } from "@/lib/utils/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, color, brand, description, location, status, date_reported, image_url } = body;

    if (!title || !category || !location || !status || !date_reported) {
      return NextResponse.json(
        { error: "Title, category, location, status, and date are required" },
        { status: 400 }
      );
    }

    if (!["lost", "found"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'lost' or 'found'" },
        { status: 400 }
      );
    }

    const item = await createItem(session.id, {
      title,
      category,
      color,
      brand,
      description,
      location,
      status,
      date_reported,
      image_url,
    });

    return NextResponse.json({ message: "Item created successfully", item });
  } catch (error) {
    console.error("Create item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "lost" | "found" | null;
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || undefined;
    const color = searchParams.get("color") || undefined;
    const date = searchParams.get("date") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const userId = searchParams.get("userId");

    if (userId) {
      const items = await getItemsByUserId(userId);
      return NextResponse.json({ items });
    }

    if (status) {
      const result = await getItemsByStatus(status, { search, category, location, color, date, limit, offset });
      return NextResponse.json(result);
    }

    const result = await getAllItems({ search, category, location, color, date, limit, offset });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get items error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
