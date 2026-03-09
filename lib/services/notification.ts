import { db } from "@/lib/db";
import { Notification } from "@/types";
import { generateId } from "@/lib/utils";

export async function createNotification(
  userId: string,
  title: string,
  message: string
): Promise<Notification> {
  const id = generateId();

  await db.execute({
    sql: `INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)`,
    args: [id, userId, title, message],
  });

  return {
    id,
    user_id: userId,
    title,
    message,
    is_read: false,
    created_at: new Date().toISOString(),
  };
}

export async function getNotificationsByUser(
  userId: string,
  limit: number = 20
): Promise<Notification[]> {
  const result = await db.execute({
    sql: "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
    args: [userId, limit],
  });

  return result.rows as unknown as Notification[];
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await db.execute({
    sql: "UPDATE notifications SET is_read = TRUE WHERE id = ?",
    args: [id],
  });
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await db.execute({
    sql: "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
    args: [userId],
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE",
    args: [userId],
  });

  return result.rows[0]?.count as number;
}

export async function deleteNotification(id: string): Promise<void> {
  await db.execute({
    sql: "DELETE FROM notifications WHERE id = ?",
    args: [id],
  });
}
