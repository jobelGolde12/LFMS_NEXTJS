export type UserRole = "user" | "admin";
export type ItemStatus = "lost" | "found";
export type MatchStatus = "suggested" | "confirmed" | "rejected";
export type ClaimStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  reporter_name?: string;
  title: string;
  category: string;
  color?: string;
  brand?: string;
  description?: string;
  location: string;
  status: ItemStatus;
  date_reported: string;
  image_url?: string;
  created_at: string;
}

export interface ItemMatch {
  id: string;
  lost_item_id: string;
  found_item_id: string;
  score: number;
  status: MatchStatus;
  created_at: string;
  lost_item?: Item;
  found_item?: Item;
  matched_attributes?: string[];
}

export interface ItemClaim {
  id: string;
  item_id: string;
  user_id: string;
  status: ClaimStatus;
  created_at: string;
  item?: Item;
  user?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalLostItems: number;
  totalFoundItems: number;
  totalMatchedItems: number;
  recentReports: Item[];
}

export interface CreateItemInput {
  title: string;
  category: string;
  color?: string;
  brand?: string;
  description?: string;
  location: string;
  status: ItemStatus;
  date_reported: string;
  image_url?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MatchScore {
  score: number;
  titleSimilarity: number;
  descriptionSimilarity: number;
  locationSimilarity: number;
  dateDiffDays: number;
  category: boolean;
  title: boolean;
  location: boolean;
  locationPartial: boolean;
  color: boolean;
  brand: boolean;
  date: boolean;
  matchedAttributes: string[];
}

export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Books",
  "Keys",
  "Wallet",
  "Phone",
  "Laptop",
  "ID/Cards",
  "Jewelry",
  "Bag",
  "Other",
] as const;

export const COLORS = [
  "Black",
  "White",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Brown",
  "Gold",
  "Silver",
  "Multi",
  "Other",
] as const;
