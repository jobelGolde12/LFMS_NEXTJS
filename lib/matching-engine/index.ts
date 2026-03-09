import { db } from "@/lib/db";
import { Item, ItemMatch, MatchScore } from "@/types";
import { generateId } from "@/lib/utils";

const MATCH_THRESHOLD = 60;
const MAX_SCORE = 100;

const WEIGHTS = {
  category: 30,
  title: 20,
  brand: 15,
  color: 10,
  description: 15,
  locationExact: 20,
  locationPartial: 10,
  dateNear: 10,
  dateWeek: 5,
};

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "with",
  "and",
  "or",
  "at",
  "in",
  "on",
  "to",
  "for",
  "of",
  "near",
  "from",
  "my",
  "is",
  "was",
]);

const COLOR_GROUPS: Record<string, string[]> = {
  black: ["black", "dark black", "jet black", "charcoal"],
  blue: ["blue", "dark blue", "navy", "royal blue", "sky blue"],
  red: ["red", "dark red", "maroon"],
  green: ["green", "dark green", "olive"],
  white: ["white", "off white"],
  gray: ["gray", "grey", "dark gray", "dark grey", "silver"],
  brown: ["brown", "tan", "beige"],
  yellow: ["yellow", "gold"],
  purple: ["purple", "violet"],
  pink: ["pink"],
  orange: ["orange"],
};

function toPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalize(value?: string | null): string {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function tokenize(value?: string | null): string[] {
  return normalize(value)
    .split(" ")
    .filter((token) => token && !STOP_WORDS.has(token));
}

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = Array.from(setA).filter((token) => setB.has(token)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function bigramSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;

  const makeBigrams = (input: string): string[] => {
    const text = input.replace(/\s+/g, " ");
    if (text.length < 2) return [text];
    const grams: string[] = [];
    for (let i = 0; i < text.length - 1; i++) {
      grams.push(text.slice(i, i + 2));
    }
    return grams;
  };

  const aBigrams = makeBigrams(a);
  const bBigrams = makeBigrams(b);
  const counts = new Map<string, number>();

  for (const gram of aBigrams) {
    counts.set(gram, (counts.get(gram) || 0) + 1);
  }

  let intersection = 0;
  for (const gram of bBigrams) {
    const count = counts.get(gram) || 0;
    if (count > 0) {
      intersection += 1;
      counts.set(gram, count - 1);
    }
  }

  return (2 * intersection) / (aBigrams.length + bBigrams.length);
}

function dateDifferenceInDays(a: string, b: string): number {
  const aDate = new Date(a);
  const bDate = new Date(b);
  const diff = Math.abs(aDate.getTime() - bDate.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function canonicalColor(input?: string | null): string {
  const value = normalize(input);
  if (!value) return "";

  for (const [canonical, variants] of Object.entries(COLOR_GROUPS)) {
    if (variants.some((variant) => value.includes(variant) || variant.includes(value))) {
      return canonical;
    }
  }

  return value;
}

export function calculateMatchScore(lostItem: Item, foundItem: Item): MatchScore {
  let score = 0;
  const matchedAttributes: string[] = [];

  const lostCategory = normalize(lostItem.category);
  const foundCategory = normalize(foundItem.category);
  const category = Boolean(lostCategory && foundCategory && lostCategory === foundCategory);
  if (category) {
    score += WEIGHTS.category;
    matchedAttributes.push("Same category");
  }

  const titleSimilarity = bigramSimilarity(normalize(lostItem.title), normalize(foundItem.title));
  const title = titleSimilarity >= 0.7;
  if (title) {
    score += WEIGHTS.title;
    matchedAttributes.push("Similar item title");
  }

  const brand = Boolean(
    normalize(lostItem.brand) &&
      normalize(foundItem.brand) &&
      normalize(lostItem.brand) === normalize(foundItem.brand)
  );
  if (brand) {
    score += WEIGHTS.brand;
    matchedAttributes.push("Same brand");
  }

  const color = Boolean(
    canonicalColor(lostItem.color) &&
      canonicalColor(foundItem.color) &&
      canonicalColor(lostItem.color) === canonicalColor(foundItem.color)
  );
  if (color) {
    score += WEIGHTS.color;
    matchedAttributes.push("Same/similar color");
  }

  const lostDescriptionTokens = tokenize(lostItem.description);
  const foundDescriptionTokens = tokenize(foundItem.description);
  const descriptionSimilarity = jaccardSimilarity(lostDescriptionTokens, foundDescriptionTokens);
  const commonDescriptionTokens = lostDescriptionTokens.filter((token) =>
    new Set(foundDescriptionTokens).has(token)
  ).length;
  if (descriptionSimilarity >= 0.3 || commonDescriptionTokens >= 2) {
    score += WEIGHTS.description;
    matchedAttributes.push("Description keyword overlap");
  }

  const lostLocation = normalize(lostItem.location);
  const foundLocation = normalize(foundItem.location);
  const location = Boolean(lostLocation && foundLocation && lostLocation === foundLocation);
  let locationPartial = false;

  if (location) {
    score += WEIGHTS.locationExact;
    matchedAttributes.push("Same location");
  } else {
    const locationSimilarity = Math.max(
      bigramSimilarity(lostLocation, foundLocation),
      jaccardSimilarity(tokenize(lostLocation), tokenize(foundLocation))
    );
    locationPartial = locationSimilarity >= 0.45;

    if (locationPartial) {
      score += WEIGHTS.locationPartial;
      matchedAttributes.push("Similar location");
    }
  }

  const dateDiffDays = dateDifferenceInDays(lostItem.date_reported, foundItem.date_reported);
  let date = false;
  if (dateDiffDays <= 3) {
    score += WEIGHTS.dateNear;
    date = true;
    matchedAttributes.push("Reported within 3 days");
  } else if (dateDiffDays <= 7) {
    score += WEIGHTS.dateWeek;
    date = true;
    matchedAttributes.push("Reported within 7 days");
  }

  const locationSimilarity = Math.max(
    bigramSimilarity(lostLocation, foundLocation),
    jaccardSimilarity(tokenize(lostLocation), tokenize(foundLocation))
  );

  const finalScore = Math.min(MAX_SCORE, score);

  return {
    score: finalScore,
    titleSimilarity: Math.round(titleSimilarity * 100),
    descriptionSimilarity: Math.round(descriptionSimilarity * 100),
    locationSimilarity: Math.round(locationSimilarity * 100),
    dateDiffDays,
    category,
    title,
    location,
    locationPartial,
    color,
    brand,
    date,
    matchedAttributes,
  };
}

async function upsertSuggestedMatch(lostItem: Item, foundItem: Item, score: number): Promise<ItemMatch | null> {
  const existing = await db.execute({
    sql: "SELECT id, status FROM item_matches WHERE lost_item_id = ? AND found_item_id = ? LIMIT 1",
    args: [lostItem.id, foundItem.id],
  });

  if (existing.rows.length > 0) {
    const existingId = String(existing.rows[0].id);
    const existingStatus = String(existing.rows[0].status);

    if (existingStatus === "suggested") {
      await db.execute({
        sql: "UPDATE item_matches SET score = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [score, existingId],
      });
    }

    return null;
  }

  const id = generateId();
  await db.execute({
    sql: `INSERT INTO item_matches (id, lost_item_id, found_item_id, score, status)
          VALUES (?, ?, ?, ?, 'suggested')`,
    args: [id, lostItem.id, foundItem.id, score],
  });

  return {
    id,
    lost_item_id: lostItem.id,
    found_item_id: foundItem.id,
    score,
    status: "suggested",
    created_at: new Date().toISOString(),
    lost_item: lostItem,
    found_item: foundItem,
  };
}

async function comparePairAndStore(lostItem: Item, foundItem: Item): Promise<ItemMatch | null> {
  const details = calculateMatchScore(lostItem, foundItem);

  console.log(
    `Matching lost item #${lostItem.id} with found item #${foundItem.id} -> score ${details.score}`
  );

  if (details.score < MATCH_THRESHOLD) {
    console.log("Match skipped (below threshold)");
    return null;
  }

  const stored = await upsertSuggestedMatch(lostItem, foundItem, details.score);
  if (stored) {
    console.log("Match stored");
    stored.matched_attributes = details.matchedAttributes;
  }

  return stored;
}

export async function runMatchingForItem(newItem: Item): Promise<ItemMatch[]> {
  const isLost = newItem.status === "lost";

  const oppositeItemsResult = await db.execute({
    sql: `SELECT * FROM items
          WHERE status = ?
            AND (
              lower(category) = lower(?)
              OR lower(location) = lower(?)
              OR abs(julianday(date_reported) - julianday(?)) <= 30
            )`,
    args: [isLost ? "found" : "lost", newItem.category, newItem.location, newItem.date_reported],
  });

  const oppositeItems = oppositeItemsResult.rows as unknown as Item[];
  const normalizedOppositeItems = oppositeItems.map((item) => toPlainObject(item));
  const matches: ItemMatch[] = [];

  for (const item of normalizedOppositeItems) {
    const result = await comparePairAndStore(isLost ? newItem : item, isLost ? item : newItem);
    if (result) matches.push(result);
  }

  return matches;
}

export async function runMatchingEngine(): Promise<ItemMatch[]> {
  const [lostItemsResult, foundItemsResult] = await Promise.all([
    db.execute({ sql: "SELECT * FROM items WHERE status = 'lost'" }),
    db.execute({ sql: "SELECT * FROM items WHERE status = 'found'" }),
  ]);

  const lostItems = (lostItemsResult.rows as unknown as Item[]).map((item) => toPlainObject(item));
  const foundItems = (foundItemsResult.rows as unknown as Item[]).map((item) => toPlainObject(item));
  const matches: ItemMatch[] = [];

  for (const lostItem of lostItems) {
    for (const foundItem of foundItems) {
      const result = await comparePairAndStore(lostItem, foundItem);
      if (result) matches.push(result);
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

  const [countResult, matchesResult] = await Promise.all([
    db.execute({
      sql: `SELECT COUNT(*) as count FROM item_matches ${whereClause}`,
      args: params,
    }),
    db.execute({
      sql: `SELECT * FROM item_matches ${whereClause} ORDER BY score DESC, created_at DESC LIMIT ? OFFSET ?`,
      args: [...params, limit, offset],
    }),
  ]);

  const matches: ItemMatch[] = [];
  for (const row of matchesResult.rows) {
    const match = row as unknown as ItemMatch;
    const [lostItem, foundItem] = await Promise.all([
      db.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [match.lost_item_id] }),
      db.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [match.found_item_id] }),
    ]);

    const lost = toPlainObject(lostItem.rows[0] as unknown as Item);
    const found = toPlainObject(foundItem.rows[0] as unknown as Item);
    const details = calculateMatchScore(lost, found);

    matches.push(toPlainObject({
      ...match,
      lost_item: lost,
      found_item: found,
      matched_attributes: details.matchedAttributes,
    }));
  }

  return { matches, total: Number(countResult.rows[0]?.count || 0) };
}

export async function getMatchById(id: string): Promise<ItemMatch | null> {
  const result = await db.execute({
    sql: "SELECT * FROM item_matches WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) return null;

  const match = toPlainObject(result.rows[0] as unknown as ItemMatch);
  const [lostItemResult, foundItemResult] = await Promise.all([
    db.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [match.lost_item_id] }),
    db.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [match.found_item_id] }),
  ]);

  const lost = toPlainObject(lostItemResult.rows[0] as unknown as Item);
  const found = toPlainObject(foundItemResult.rows[0] as unknown as Item);
  const details = calculateMatchScore(lost, found);

  return toPlainObject({
    ...match,
    lost_item: lost,
    found_item: found,
    matched_attributes: details.matchedAttributes,
  });
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
  return Number(result.rows[0]?.count || 0);
}
