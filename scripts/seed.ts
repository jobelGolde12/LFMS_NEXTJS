import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { hashPassword } from "@/lib/utils/auth";
import { generateId } from "@/lib/utils";

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

const philippineLocations = [
  "Main Building - Lobby",
  "Library - 2nd Floor",
  "Cafeteria",
  "Computer Laboratory 1",
  "Science Building",
  "Gymnasium",
  "Admin Building",
  "Dormitory",
  "Parking Area",
  "Chapel",
  "Student Center",
  "Auditorium",
  "Science Laboratory",
  "Music Room",
  "Sports Field",
];

const categories = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Books",
  "Keys",
  "Wallet",
  "Phone",
  "ID/Cards",
  "Jewelry",
  "Bag",
  "Umbrella",
  "Watch",
];

const colors = [
  "Black",
  "White",
  "Gray",
  "Blue",
  "Red",
  "Green",
  "Brown",
  "Gold",
  "Silver",
  "Pink",
];

const brands = [
  "Apple",
  "Samsung",
  "OPPO",
  "Vivo",
  "Xiaomi",
  "Huawei",
  "Lenovo",
  "Acer",
  "HP",
  "Dell",
  "Nike",
  "Adidas",
  "Unichamp",
  "Penshoppe",
  "Classic",
];

const filipinoFirstNames = [
  "Juan", "Maria", "Jose", "Ana", "Pedro", "Rosa", "Carlos", "Carmen",
  "Miguel", "Lucia", "Antonio", "Clara", "Francisco", "Mercedes",
  "Ramon", "Teresa", "Ricardo", "Gloria", "Jonathan", "Jessica",
  "Mark", "Sarah", "Christian", "Kate", "Daniel", "Ashley",
  "James", "Emily", "Michael", "Nicole", "Brian", "Jennifer",
  "Kenneth", "Stephanie", "Ronald", "Michelle", "Anthony", "Angela",
];

const filipinoLastNames = [
  "Dela Cruz", "Garcia", "Reyes", "Mendoza", "Torres", "Flores",
  "Rivera", "Santos", "Bautista", "Castillo", "Jimenez", "Vargas",
  "Aquino", "Mabini", "Bonifacio", "Rizal", "Aguinaldo", "Macapagal",
  "Santiago", "Cruz", "Lopez", "Gonzalez", "Hernandez", "Martinez",
  "Perez", "Sanchez", "Ramirez", "Torres", "Flores", "Villar",
  "Ocampo", "Zamora", "Velarde", "Santos", "Uy", "Co",
  "Sy", "Tan", "Chua", "Lee", "Ng", "Lim",
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split("T")[0];
}

async function seed() {
  console.log("Seeding database...");
  
  // Create admin user
  const adminId = generateId();
  const hashedPassword = await hashPassword("admin123");
  
  await db.execute({
    sql: `INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
    args: [adminId, "System Administrator", "admin@sorsu.edu", hashedPassword, "admin"],
  });
  
  console.log("✓ Created admin user (admin@sorsu.edu / admin123)");
  
  // Create regular users
  const users = [];
  const userCount = 20;
  
  for (let i = 0; i < userCount; i++) {
    const userId = generateId();
    const firstName = randomElement(filipinoFirstNames);
    const lastName = randomElement(filipinoLastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@ssu.edu.ph`;
    const password = await hashPassword("password123");
    
    await db.execute({
      sql: `INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      args: [userId, name, email, password, "user"],
    });
    
    users.push({ id: userId, name, email });
  }
  
  console.log(`✓ Created ${userCount} users`);
  
  // Create lost items
  const lostItems = [];
  const lostCount = 15;
  
  for (let i = 0; i < lostCount; i++) {
    const itemId = generateId();
    const user = randomElement(users);
    const title = `${randomElement(brands)} ${randomElement(["Wallet", "Phone", "Bag", "Watch", "Umbrella"])}`;
    const category = randomElement(categories);
    const color = randomElement(colors);
    const brand = randomElement(brands);
    const location = randomElement(philippineLocations);
    const dateReported = randomDate(30);
    
    await db.execute({
      sql: `INSERT OR IGNORE INTO items (id, user_id, title, category, color, brand, description, location, status, date_reported) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [itemId, user.id, title, category, color, brand, `Lost ${title} near ${location}`, location, "lost", dateReported],
    });
    
    lostItems.push({ id: itemId, title, category, color, brand, location, date_reported: dateReported });
  }
  
  console.log(`✓ Created ${lostCount} lost items`);
  
  // Create found items
  const foundItems = [];
  const foundCount = 12;
  
  for (let i = 0; i < foundCount; i++) {
    const itemId = generateId();
    const user = randomElement(users);
    const title = `${randomElement(brands)} ${randomElement(["Wallet", "Phone", "Bag", "Watch", "Umbrella", "ID", "Keys"])}`;
    const category = randomElement(categories);
    const color = randomElement(colors);
    const brand = randomElement(brands);
    const location = randomElement(philippineLocations);
    const dateReported = randomDate(30);
    
    await db.execute({
      sql: `INSERT OR IGNORE INTO items (id, user_id, title, category, color, brand, description, location, status, date_reported) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [itemId, user.id, title, category, color, brand, `Found ${title} at ${location}`, location, "found", dateReported],
    });
    
    foundItems.push({ id: itemId, title, category, color, brand, location, date_reported: dateReported });
  }
  
  console.log(`✓ Created ${foundCount} found items`);
  
  // Create some matches
  const matchCount = 5;
  for (let i = 0; i < matchCount; i++) {
    const matchId = generateId();
    const lostItem = randomElement(lostItems);
    const foundItem = randomElement(foundItems);
    const score = 60 + Math.floor(Math.random() * 40);
    const status = i < 2 ? "suggested" : (i < 4 ? "confirmed" : "rejected");
    
    await db.execute({
      sql: `INSERT OR IGNORE INTO item_matches (id, lost_item_id, found_item_id, score, status) VALUES (?, ?, ?, ?, ?)`,
      args: [matchId, lostItem.id, foundItem.id, score, status],
    });
  }
  
  console.log(`✓ Created ${matchCount} matches`);
  
  // Create some claims
  const claimCount = 3;
  for (let i = 0; i < claimCount; i++) {
    const claimId = generateId();
    const item = randomElement(foundItems);
    const user = randomElement(users);
    const status = i === 0 ? "pending" : (i === 1 ? "approved" : "rejected");
    
    await db.execute({
      sql: `INSERT OR IGNORE INTO item_claims (id, item_id, user_id, status) VALUES (?, ?, ?, ?)`,
      args: [claimId, item.id, user.id, status],
    });
  }
  
  console.log(`✓ Created ${claimCount} claims`);
  
  // Create some notifications
  const notificationCount = 8;
  for (let i = 0; i < notificationCount; i++) {
    const notifId = generateId();
    const user = randomElement(users);
    const title = randomElement([
      "New Match Found",
      "Claim Approved",
      "Item Match Confirmed",
      "New Found Item",
    ]);
    const message = randomElement([
      "A matching item has been found for your lost item.",
      "Your claim request has been approved.",
      "Your match has been confirmed by admin.",
      "A new item has been reported that matches your lost item.",
    ]);
    
    await db.execute({
      sql: `INSERT OR IGNORE INTO notifications (id, user_id, title, message, is_read) VALUES (?, ?, ?, ?, ?)`,
      args: [notifId, user.id, title, message, Math.random() > 0.5],
    });
  }
  
  console.log(`✓ Created ${notificationCount} notifications`);
  
  console.log("\n✅ Database seeded successfully!");
  console.log("\nTest accounts:");
  console.log("  Admin: admin@sorsu.edu / admin123");
  console.log("  User: juan.delacruz0@ssu.edu.ph / password123");
}

seed().catch(console.error);
