import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
  console.error("Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

const db = createClient({
  url: databaseUrl,
  authToken,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT,
    brand TEXT,
    description TEXT,
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('lost', 'found')),
    date_reported DATE NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_items_location ON items(location)`,
  `CREATE INDEX IF NOT EXISTS idx_items_category ON items(category)`,
  `CREATE INDEX IF NOT EXISTS idx_items_status ON items(status)`,
  `CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id)`,
  `CREATE TABLE IF NOT EXISTS item_matches (
    id TEXT PRIMARY KEY,
    lost_item_id TEXT NOT NULL,
    found_item_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'suggested' CHECK(status IN ('suggested', 'confirmed', 'rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lost_item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (found_item_id) REFERENCES items(id) ON DELETE CASCADE,
    UNIQUE(lost_item_id, found_item_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_item_matches_lost ON item_matches(lost_item_id)`,
  `CREATE INDEX IF NOT EXISTS idx_item_matches_found ON item_matches(found_item_id)`,
  `CREATE INDEX IF NOT EXISTS idx_item_matches_status ON item_matches(status)`,
  `CREATE TABLE IF NOT EXISTS item_claims (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_item_claims_item ON item_claims(item_id)`,
  `CREATE INDEX IF NOT EXISTS idx_item_claims_user ON item_claims(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_item_claims_status ON item_claims(status)`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read)`,
];

async function migrate() {
  console.log("Migrating database...");
  
  for (const sql of statements) {
    try {
      await db.execute(sql);
      console.log("✓ Executed:", sql.slice(0, 50) + "...");
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === "TABLE_ALREADY_EXISTS" || err.code === "INDEX_ALREADY_EXISTS") {
        console.log("✓ Already exists:", sql.slice(0, 50) + "...");
      } else {
        console.error("✗ Failed:", sql.slice(0, 50) + "...");
        console.error(error);
      }
    }
  }
  
  console.log("\nDatabase migration completed!");
  process.exit(0);
}

migrate();
