import { db } from "@/lib/db";
import { Item, CreateItemInput, ItemStatus } from "@/types";
import { generateId } from "@/lib/utils";

export async function createItem(userId: string, input: CreateItemInput): Promise<Item> {
  const id = generateId();
  const {
    title,
    category,
    color,
    brand,
    description,
    location,
    status,
    date_reported,
    image_url,
  } = input;

  await db.execute({
    sql: `INSERT INTO items (id, user_id, title, category, color, brand, description, location, status, date_reported, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      userId,
      title,
      category,
      color || null,
      brand || null,
      description || null,
      location,
      status,
      date_reported,
      image_url || null,
    ],
  });

  return {
    id,
    user_id: userId,
    title,
    category,
    color,
    brand,
    description,
    location,
    status,
    date_reported,
    image_url,
    created_at: new Date().toISOString(),
  };
}

export async function getItemById(id: string): Promise<Item | null> {
  const result = await db.execute({
    sql: `SELECT items.*, users.name as reporter_name
          FROM items
          LEFT JOIN users ON users.id = items.user_id
          WHERE items.id = ?`,
    args: [id],
  });

  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as Item;
}

export async function getItemsByStatus(
  status: ItemStatus,
  options?: {
    search?: string;
    category?: string;
    location?: string;
    color?: string;
    date?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ items: Item[]; total: number }> {
  const { search, category, location, color, date, limit = 20, offset = 0 } = options || {};

  let whereClause = "WHERE status = ?";
  const params: (string | number)[] = [status];

  if (search) {
    whereClause += ` AND (title LIKE ? OR description LIKE ? OR location LIKE ? OR category LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (category) {
    whereClause += " AND category = ?";
    params.push(category);
  }

  if (location) {
    whereClause += " AND location = ?";
    params.push(location);
  }
  if (color) {
    whereClause += " AND color = ?";
    params.push(color);
  }
  if (date) {
    whereClause += " AND date_reported = ?";
    params.push(date);
  }

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM items ${whereClause}`,
    args: params,
  });

  const itemsResult = await db.execute({
    sql: `SELECT items.*, users.name as reporter_name
          FROM items
          LEFT JOIN users ON users.id = items.user_id
          ${whereClause}
          ORDER BY items.created_at DESC
          LIMIT ? OFFSET ?`,
    args: [...params, limit, offset],
  });

  return {
    items: itemsResult.rows as unknown as Item[],
    total: countResult.rows[0]?.count as number,
  };
}

export async function getAllItems(options?: {
  search?: string;
  category?: string;
  location?: string;
  color?: string;
  date?: string;
  status?: ItemStatus;
  limit?: number;
  offset?: number;
}): Promise<{ items: Item[]; total: number }> {
  const { search, category, location, color, date, status, limit = 20, offset = 0 } = options || {};

  let whereClause = "WHERE 1=1";
  const params: (string | number)[] = [];

  if (status) {
    whereClause += " AND status = ?";
    params.push(status);
  }

  if (search) {
    whereClause += ` AND (title LIKE ? OR description LIKE ? OR location LIKE ? OR category LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (category) {
    whereClause += " AND category = ?";
    params.push(category);
  }

  if (location) {
    whereClause += " AND location = ?";
    params.push(location);
  }
  if (color) {
    whereClause += " AND color = ?";
    params.push(color);
  }
  if (date) {
    whereClause += " AND date_reported = ?";
    params.push(date);
  }

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM items ${whereClause}`,
    args: params,
  });

  const itemsResult = await db.execute({
    sql: `SELECT items.*, users.name as reporter_name
          FROM items
          LEFT JOIN users ON users.id = items.user_id
          ${whereClause}
          ORDER BY items.created_at DESC
          LIMIT ? OFFSET ?`,
    args: [...params, limit, offset],
  });

  return {
    items: itemsResult.rows as unknown as Item[],
    total: countResult.rows[0]?.count as number,
  };
}

export async function getItemsByUserId(userId: string): Promise<Item[]> {
  const result = await db.execute({
    sql: "SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC",
    args: [userId],
  });

  return result.rows as unknown as Item[];
}

export async function getRecentItems(limit: number = 10): Promise<Item[]> {
  const result = await db.execute({
    sql: "SELECT * FROM items ORDER BY created_at DESC LIMIT ?",
    args: [limit],
  });

  return result.rows as unknown as Item[];
}

export async function getItemCountByStatus(status: ItemStatus): Promise<number> {
  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM items WHERE status = ?",
    args: [status],
  });

  return result.rows[0]?.count as number;
}

export async function deleteItem(id: string): Promise<void> {
  await db.execute({
    sql: "DELETE FROM items WHERE id = ?",
    args: [id],
  });
}

export async function updateItem(id: string, input: Partial<CreateItemInput>): Promise<Item | null> {
  const current = await getItemById(id);
  if (!current) return null;

  const updated = { ...current, ...input };
  
  await db.execute({
    sql: `UPDATE items SET title = ?, category = ?, color = ?, brand = ?, description = ?, 
          location = ?, date_reported = ?, image_url = ? WHERE id = ?`,
    args: [
      updated.title,
      updated.category,
      updated.color || null,
      updated.brand || null,
      updated.description || null,
      updated.location,
      updated.date_reported,
      updated.image_url || null,
      id,
    ],
  });

  return updated;
}
