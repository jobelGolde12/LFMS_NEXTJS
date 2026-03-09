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
  locationSimilar: 10,
  dateWithin3: 10,
  dateWithin7: 5,
};

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "to", "for", "of", "in", "on", "at", "with", "from", "near",
  "lost", "found", "item", "items", "report", "reported", "my", "is", "was",
]);

const COLOR_ALIASES: Record<string, string[]> = {
  black: ["black", "dark black", "charcoal", "jet black"],
  blue: ["blue", "dark blue", "navy", "sky blue", "royal blue"],
  red: ["red", "dark red", "maroon"],
  green: ["green", "dark green", "olive"],
  gray: ["gray", "grey", "dark gray", "dark grey", "silver"],
  white: ["white", "off white"],
  brown: ["brown", "tan", "beige"],
  yellow: ["yellow", "gold"],
  purple: ["purple", "violet"],
  pink: ["pink"],
  orange: ["orange"],
};

function plain<T>(value: T): T {
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
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const inter = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : inter / union;
}

function overlapCount(a: string[], b: string[]): number {
  const setB = new Set(b);
  return a.filter((x) => setB.has(x)).length;
}

function bigramSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;

  const grams = (text: string): string[] => {
    const s = text.replace(/\s+/g, " ");
    if (s.length < 2) return [s];
    const out: string[] = [];
    for (let i = 0; i < s.length - 1; i += 1) out.push(s.slice(i, i + 2));
    return out;
  };

  const aGrams = grams(a);
  const bGrams = grams(b);
  const counts = new Map<string, number>();
  for (const g of aGrams) counts.set(g, (counts.get(g) || 0) + 1);

  let inter = 0;
  for (const g of bGrams) {
    const c = counts.get(g) || 0;
    if (c > 0) {
      inter += 1;
      counts.set(g, c - 1);
    }
  }

  return (2 * inter) / (aGrams.length + bGrams.length);
}

function canonicalColor(value?: string | null): string {
  const v = normalize(value);
  if (!v) return "";

  for (const [name, aliases] of Object.entries(COLOR_ALIASES)) {
    if (aliases.some((a) => v.includes(a) || a.includes(v))) return name;
  }

  return v;
}

function dateDiffDays(a: string, b: string): number {
  const diff = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function safeLower(v?: string | null): string {
  return normalize(v);
}

export function calculateMatchScore(lostItem: Item, foundItem: Item): MatchScore {
  let score = 0;
  const matchedAttributes: string[] = [];

  const category = safeLower(lostItem.category) === safeLower(foundItem.category) && !!safeLower(lostItem.category);
  if (category) {
    score += WEIGHTS.category;
    matchedAttributes.push("Same category");
  }

  const lostTitleTokens = tokenize(lostItem.title);
  const foundTitleTokens = tokenize(foundItem.title);
  const titleBi = bigramSimilarity(safeLower(lostItem.title), safeLower(foundItem.title));
  const titleJac = jaccard(lostTitleTokens, foundTitleTokens);
  const titleOverlap = overlapCount(lostTitleTokens, foundTitleTokens);
  const titleSimilarity = Math.max(titleBi, titleJac);
  const title = (titleSimilarity >= 0.7 && titleOverlap >= 1) || titleOverlap >= 2;
  if (title) {
    score += WEIGHTS.title;
    matchedAttributes.push("Similar item title");
  }

  const brand = !!safeLower(lostItem.brand) && safeLower(lostItem.brand) === safeLower(foundItem.brand);
  if (brand) {
    score += WEIGHTS.brand;
    matchedAttributes.push("Same brand");
  }

  const color = !!canonicalColor(lostItem.color) && canonicalColor(lostItem.color) === canonicalColor(foundItem.color);
  if (color) {
    score += WEIGHTS.color;
    matchedAttributes.push("Same/similar color");
  }

  const lostDescTokens = tokenize(lostItem.description);
  const foundDescTokens = tokenize(foundItem.description);
  const descriptionSimilarity = jaccard(lostDescTokens, foundDescTokens);
  const descriptionOverlap = overlapCount(lostDescTokens, foundDescTokens);
  const description = descriptionSimilarity >= 0.35 || descriptionOverlap >= 3;
  if (description) {
    score += WEIGHTS.description;
    matchedAttributes.push("Description keyword overlap");
  }

  const lostLocation = safeLower(lostItem.location);
  const foundLocation = safeLower(foundItem.location);
  const location = !!lostLocation && lostLocation === foundLocation;
  const locationSimilarityRaw = Math.max(
    bigramSimilarity(lostLocation, foundLocation),
    jaccard(tokenize(lostLocation), tokenize(foundLocation))
  );
  const locationPartial = !location && locationSimilarityRaw >= 0.75;

  if (location) {
    score += WEIGHTS.locationExact;
    matchedAttributes.push("Same location");
  } else if (locationPartial) {
    score += WEIGHTS.locationSimilar;
    matchedAttributes.push("Similar location");
  }

  const days = dateDiffDays(lostItem.date_reported, foundItem.date_reported);
  let date = false;
  if (days <= 3) {
    score += WEIGHTS.dateWithin3;
    date = true;
    matchedAttributes.push("Date within 3 days");
  } else if (days <= 7) {
    score += WEIGHTS.dateWithin7;
    date = true;
    matchedAttributes.push("Date within 7 days");
  }

  // Category is mandatory for suggested matches.
  if (!category) {
    score = 0;
    matchedAttributes.length = 0;
  }

  const strongIdentitySignal = title || brand;
  const contextSignals = [location, locationPartial, description, date, color].filter(Boolean).length;

  // Promote category-aligned pairs when context strongly supports the same item.
  if (category && (location || locationPartial || description || date)) {
    score += 10;
    matchedAttributes.push("Category aligned with context");
  }

  // Reduce false positives: category alone should not pass unless context/identity supports it.
  if (category && !strongIdentitySignal && contextSignals < 2) {
    score = 0;
    matchedAttributes.length = 0;
  }

  // Strong mismatch guardrail.
  if (category && !strongIdentitySignal && !location && !locationPartial && !description) {
    score = Math.min(score, 55);
  }

  return {
    score: Math.min(MAX_SCORE, score),
    titleSimilarity: Math.round(titleSimilarity * 100),
    descriptionSimilarity: Math.round(descriptionSimilarity * 100),
    locationSimilarity: Math.round(locationSimilarityRaw * 100),
    dateDiffDays: days,
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

async function createOrUpdateSuggestedMatch(lostItem: Item, foundItem: Item, score: number): Promise<ItemMatch | null> {
  const existing = await db.execute({
    sql: "SELECT id, status FROM item_matches WHERE lost_item_id = ? AND found_item_id = ? LIMIT 1",
    args: [lostItem.id, foundItem.id],
  });

  if (existing.rows.length > 0) {
    const id = String(existing.rows[0].id);
    const status = String(existing.rows[0].status);

    if (status === "suggested") {
      await db.execute({
        sql: "UPDATE item_matches SET score = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [score, id],
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

  return plain({
    id,
    lost_item_id: lostItem.id,
    found_item_id: foundItem.id,
    score,
    status: "suggested",
    created_at: new Date().toISOString(),
    lost_item: lostItem,
    found_item: foundItem,
  });
}

async function compareAndStore(lostItem: Item, foundItem: Item): Promise<ItemMatch | null> {
  const details = calculateMatchScore(lostItem, foundItem);
  console.log(`Matching lost #${lostItem.id} vs found #${foundItem.id} => ${details.score}`);

  if (details.score < MATCH_THRESHOLD) {
    console.log("Match skipped (below threshold)");
    return null;
  }

  const match = await createOrUpdateSuggestedMatch(lostItem, foundItem, details.score);
  if (match) {
    match.matched_attributes = details.matchedAttributes;
    console.log("Match stored");
  }

  return match;
}

export async function runMatchingForItem(newItem: Item): Promise<ItemMatch[]> {
  const item = plain(newItem);
  const targetStatus = item.status === "lost" ? "found" : "lost";

  const result = await db.execute({
    sql: `SELECT * FROM items WHERE status = ?
          AND (
            lower(category) = lower(?)
            OR lower(location) = lower(?)
            OR abs(julianday(date_reported) - julianday(?)) <= 30
          )`,
    args: [targetStatus, item.category, item.location, item.date_reported],
  });

  const candidates = (result.rows as unknown as Item[]).map((x) => plain(x));
  const matches: ItemMatch[] = [];

  for (const candidate of candidates) {
    const match =
      item.status === "lost"
        ? await compareAndStore(item, candidate)
        : await compareAndStore(candidate, item);

    if (match) matches.push(match);
  }

  return matches;
}

export async function runMatchingEngine(): Promise<ItemMatch[]> {
  const [lostResult, foundResult] = await Promise.all([
    db.execute({ sql: "SELECT * FROM items WHERE status = 'lost'" }),
    db.execute({ sql: "SELECT * FROM items WHERE status = 'found'" }),
  ]);

  const lostItems = (lostResult.rows as unknown as Item[]).map((x) => plain(x));
  const foundItems = (foundResult.rows as unknown as Item[]).map((x) => plain(x));
  const matches: ItemMatch[] = [];

  for (const lostItem of lostItems) {
    for (const foundItem of foundItems) {
      const match = await compareAndStore(lostItem, foundItem);
      if (match) matches.push(match);
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

  const [countResult, result] = await Promise.all([
    db.execute({ sql: `SELECT COUNT(*) as count FROM item_matches ${whereClause}`, args: params }),
    db.execute({
      sql: `SELECT * FROM item_matches ${whereClause} ORDER BY score DESC, created_at DESC LIMIT ? OFFSET ?`,
      args: [...params, limit, offset],
    }),
  ]);

  const matches: ItemMatch[] = [];

  for (const row of result.rows) {
    const match = plain(row as unknown as ItemMatch);
    const [lost, found] = await Promise.all([
      db.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [match.lost_item_id] }),
      db.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [match.found_item_id] }),
    ]);

    const lostItem = plain(lost.rows[0] as unknown as Item);
    const foundItem = plain(found.rows[0] as unknown as Item);
    const details = calculateMatchScore(lostItem, foundItem);

    if (match.status === "suggested") {
      if (details.score < MATCH_THRESHOLD) {
        continue;
      }
      if (Number(match.score) !== details.score) {
        await db.execute({
          sql: "UPDATE item_matches SET score = ? WHERE id = ?",
          args: [details.score, match.id],
        });
      }
    }

    matches.push(
      plain({
        ...match,
        score: details.score,
        lost_item: lostItem,
        found_item: foundItem,
        matched_attributes: details.matchedAttributes,
      })
    );
  }

  return { matches, total: Number(countResult.rows[0]?.count || 0) };
}

export async function getMatchById(id: string): Promise<ItemMatch | null> {
  const result = await db.execute({ sql: "SELECT * FROM item_matches WHERE id = ?", args: [id] });
  if (result.rows.length === 0) return null;

  const match = plain(result.rows[0] as unknown as ItemMatch);
  const [lost, found] = await Promise.all([
    db.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [match.lost_item_id] }),
    db.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [match.found_item_id] }),
  ]);

  const lostItem = plain(lost.rows[0] as unknown as Item);
  const foundItem = plain(found.rows[0] as unknown as Item);
  const details = calculateMatchScore(lostItem, foundItem);

  if (match.status === "suggested" && Number(match.score) !== details.score) {
    await db.execute({ sql: "UPDATE item_matches SET score = ? WHERE id = ?", args: [details.score, match.id] });
  }

  return plain({
    ...match,
    score: details.score,
    lost_item: lostItem,
    found_item: foundItem,
    matched_attributes: details.matchedAttributes,
  });
}

export async function updateMatchStatus(
  id: string,
  status: "suggested" | "confirmed" | "rejected"
): Promise<void> {
  await db.execute({ sql: "UPDATE item_matches SET status = ? WHERE id = ?", args: [status, id] });
}

export async function getMatchCount(): Promise<number> {
  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM item_matches WHERE status != 'rejected'",
  });
  return Number(result.rows[0]?.count || 0);
}
