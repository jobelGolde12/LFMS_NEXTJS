import { db } from "@/lib/db";
import { Item, ItemMatch, MatchScore } from "@/types";
import { generateId } from "@/lib/utils";

const WEIGHTS = {
  category: 40,
  location: 30,
  color: 15,
  brand: 10,
  date: 5,
};

const DATE_THRESHOLD_DAYS = 7;

export function calculateMatchScore(lostItem: Item, foundItem: Item): MatchScore {
  let score = 0;
  
  const category = lostItem.category.toLowerCase() === foundItem.category.toLowerCase();
  const location = lostItem.location.toLowerCase() === foundItem.location.toLowerCase();
  const color = lostItem.color?.toLowerCase() === foundItem.color?.toLowerCase();
  const brand = lostItem.brand?.toLowerCase() === foundItem.brand?.toLowerCase();
  
  const lostDate = new Date(lostItem.date_reported);
  const foundDate = new Date(foundItem.date_reported);
  const dateDiff = Math.abs(lostDate.getTime() - foundDate.getTime());
  const dateDays = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));
  const date = dateDays <= DATE_THRESHOLD_DAYS;

  if (category) score += WEIGHTS.category;
  if (location) score += WEIGHTS.location;
  if (color) score += WEIGHTS.color;
  if (brand) score += WEIGHTS.brand;
  if (date) score += WEIGHTS.date;

  return { score, category, location, color, brand, date };
}

export async function runMatchingEngine(): Promise<ItemMatch[]> {
  const lostItemsResult = await db.execute({
    sql: "SELECT * FROM items WHERE status = 'lost'",
  });
  const foundItemsResult = await db.execute({
    sql: "SELECT * FROM items WHERE status = 'found'",
  });

  const lostItems = lostItemsResult.rows as unknown as Item[];
  const foundItems = foundItemsResult.rows as unknown as Item[];
  const matches: ItemMatch[] = [];

  for (const lostItem of lostItems) {
    for (const foundItem of foundItems) {
      const matchScore = calculateMatchScore(lostItem, foundItem);

      if (matchScore.score >= 60) {
        const existingMatch = await db.execute({
          sql: "SELECT * FROM item_matches WHERE lost_item_id = ? AND found_item_id = ?",
          args: [lostItem.id, foundItem.id],
        });

        if (existingMatch.rows.length === 0) {
          const id = generateId();
          await db.execute({
            sql: `INSERT INTO item_matches (id, lost_item_id, found_item_id, score, status)
                  VALUES (?, ?, ?, ?, 'suggested')`,
            args: [id, lostItem.id, foundItem.id, matchScore.score],
          });

          matches.push({
            id,
            lost_item_id: lostItem.id,
            found_item_id: foundItem.id,
            score: matchScore.score,
            status: "suggested",
            created_at: new Date().toISOString(),
            lost_item: lostItem,
            found_item: foundItem,
          });
        }
      }
    }
  }

  return matches;
}

export async function getMatches(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ matches: ItemMatch[]; total: number }> {
  const { status, limit = 20, offset = 0 } = options || {};

  let whereClause = "";
  const params: (string | number)[] = [];

  if (status) {
    whereClause = "WHERE status = ?";
    params.push(status);
  }

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM item_matches ${whereClause}`,
    args: params,
  });

  const matchesResult = await db.execute({
    sql: `SELECT * FROM item_matches ${whereClause} ORDER BY score DESC, created_at DESC LIMIT ? OFFSET ?`,
    args: [...params, limit, offset],
  });

  const matches: ItemMatch[] = [];
  for (const row of matchesResult.rows) {
    const match = row as unknown as ItemMatch;
    const lostItem = await db.execute({
      sql: "SELECT * FROM items WHERE id = ?",
      args: [match.lost_item_id],
    });
    const foundItem = await db.execute({
      sql: "SELECT * FROM items WHERE id = ?",
      args: [match.found_item_id],
    });

    matches.push({
      ...match,
      lost_item: lostItem.rows[0] as unknown as Item,
      found_item: foundItem.rows[0] as unknown as Item,
    });
  }

  return { matches, total: countResult.rows[0]?.count as number };
}

export async function getMatchById(id: string): Promise<ItemMatch | null> {
  const result = await db.execute({
    sql: "SELECT * FROM item_matches WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) return null;

  const match = result.rows[0] as unknown as ItemMatch;
  const lostItem = await db.execute({
    sql: "SELECT * FROM items WHERE id = ?",
    args: [match.lost_item_id],
  });
  const foundItem = await db.execute({
    sql: "SELECT * FROM items WHERE id = ?",
    args: [match.found_item_id],
  });

  return {
    ...match,
    lost_item: lostItem.rows[0] as unknown as Item,
    found_item: foundItem.rows[0] as unknown as Item,
  };
}

export async function updateMatchStatus(
  id: string,
  status: "suggested" | "confirmed" | "rejected"
): Promise<void> {
  await db.execute({
    sql: "UPDATE item_matches SET status = ? WHERE id = ?",
    args: [status, id],
  });
}

export async function getMatchCount(): Promise<number> {
  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM item_matches WHERE status != 'rejected'",
  });
  return result.rows[0]?.count as number;
}
