import { db } from "@/lib/db";
import { ItemClaim, ClaimStatus } from "@/types";
import { generateId } from "@/lib/utils";

export async function createClaim(itemId: string, userId: string): Promise<ItemClaim> {
  const existingClaim = await db.execute({
    sql: "SELECT * FROM item_claims WHERE item_id = ? AND user_id = ?",
    args: [itemId, userId],
  });

  if (existingClaim.rows.length > 0) {
    throw new Error("You have already claimed this item");
  }

  const id = generateId();

  await db.execute({
    sql: `INSERT INTO item_claims (id, item_id, user_id, status) VALUES (?, ?, ?, 'pending')`,
    args: [id, itemId, userId],
  });

  return {
    id,
    item_id: itemId,
    user_id: userId,
    status: "pending",
    created_at: new Date().toISOString(),
  };
}

export async function getClaimsByItem(itemId: string): Promise<ItemClaim[]> {
  const result = await db.execute({
    sql: "SELECT * FROM item_claims WHERE item_id = ? ORDER BY created_at DESC",
    args: [itemId],
  });

  return result.rows as unknown as ItemClaim[];
}

export async function getClaimsByUser(userId: string): Promise<ItemClaim[]> {
  const result = await db.execute({
    sql: "SELECT * FROM item_claims WHERE user_id = ? ORDER BY created_at DESC",
    args: [userId],
  });

  const claims: ItemClaim[] = [];
  for (const row of result.rows) {
    const claim = row as unknown as ItemClaim;
    const item = await db.execute({
      sql: "SELECT * FROM items WHERE id = ?",
      args: [claim.item_id],
    });
    claims.push({
      ...claim,
      item: item.rows[0] as unknown as typeof claim extends { item: infer I } ? I : never,
    });
  }

  return claims;
}

export async function getAllClaims(options?: {
  status?: ClaimStatus;
  limit?: number;
  offset?: number;
}): Promise<{ claims: ItemClaim[]; total: number }> {
  const { status, limit = 20, offset = 0 } = options || {};

  let whereClause = "";
  const params: (string | number)[] = [];

  if (status) {
    whereClause = "WHERE status = ?";
    params.push(status);
  }

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM item_claims ${whereClause}`,
    args: params,
  });

  const claimsResult = await db.execute({
    sql: `SELECT * FROM item_claims ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    args: [...params, limit, offset],
  });

  const claims: ItemClaim[] = [];
  for (const row of claimsResult.rows) {
    const claim = row as unknown as ItemClaim;
    const item = await db.execute({
      sql: "SELECT * FROM items WHERE id = ?",
      args: [claim.item_id],
    });
    const user = await db.execute({
      sql: "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      args: [claim.user_id],
    });

    claims.push({
      ...claim,
      item: item.rows[0] as unknown as typeof claim extends { item: infer I } ? I : never,
      user: user.rows[0] as unknown as typeof claim extends { user: infer U } ? U : never,
    });
  }

  return { claims, total: countResult.rows[0]?.count as number };
}

export async function updateClaimStatus(
  claimId: string,
  status: ClaimStatus
): Promise<void> {
  await db.execute({
    sql: "UPDATE item_claims SET status = ? WHERE id = ?",
    args: [status, claimId],
  });
}

export async function getClaimById(id: string): Promise<ItemClaim | null> {
  const result = await db.execute({
    sql: "SELECT * FROM item_claims WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as ItemClaim;
}
