import { db } from "@/lib/db";
import { User, CreateUserInput, LoginInput } from "@/types";
import { hashPassword, verifyPassword } from "@/lib/utils/auth";
import { generateId } from "@/lib/utils";

export async function createUser(input: CreateUserInput): Promise<User> {
  const { name, email, password, role = "user" } = input;
  const hashedPassword = await hashPassword(password);
  const id = generateId();

  await db.execute({
    sql: `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
    args: [id, name, email, hashedPassword, role],
  });

  return {
    id,
    name,
    email,
    password: hashedPassword,
    role,
    created_at: new Date().toISOString(),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email],
  });

  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as User;
}

export async function authenticateUser(input: LoginInput): Promise<User | null> {
  const user = await getUserByEmail(input.email);
  if (!user) return null;

  const isValid = await verifyPassword(input.password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getAllUsers(): Promise<User[]> {
  const result = await db.execute({
    sql: "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC",
  });

  return result.rows as unknown as User[];
}

export async function getUserCount(): Promise<number> {
  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM users",
  });

  return result.rows[0]?.count as number;
}

export async function updateUserRole(userId: string, role: "user" | "admin"): Promise<void> {
  await db.execute({
    sql: "UPDATE users SET role = ? WHERE id = ?",
    args: [role, userId],
  });
}
