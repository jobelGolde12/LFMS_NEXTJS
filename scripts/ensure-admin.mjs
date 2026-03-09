import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
  console.error("Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

const db = createClient({ url: databaseUrl, authToken });

async function ensureAdmin() {
  const targetEmail = "admin@sorsu.edu";
  const targetName = "System Administrator";
  const targetPassword = "admin123";
  const hashed = await bcrypt.hash(targetPassword, 12);

  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE lower(trim(email)) = lower(trim(?)) LIMIT 1",
    args: [targetEmail],
  });

  if (existing.rows.length > 0) {
    const id = String(existing.rows[0].id);
    await db.execute({
      sql: "UPDATE users SET name = ?, email = ?, password = ?, role = 'admin' WHERE id = ?",
      args: [targetName, targetEmail, hashed, id],
    });
    console.log("Updated admin account:", targetEmail);
  } else {
    await db.execute({
      sql: "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, 'admin')",
      args: [uuidv4(), targetName, targetEmail, hashed],
    });
    console.log("Created admin account:", targetEmail);
  }

  console.log("Credentials:");
  console.log("  Email:", targetEmail);
  console.log("  Password:", targetPassword);
}

ensureAdmin().catch((error) => {
  console.error("Failed to ensure admin account:", error);
  process.exit(1);
});
