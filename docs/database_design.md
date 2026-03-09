# Database Design

## Schema Overview

The Lost and Found Management System uses a relational database with the following tables:

## Tables

### users
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| name | TEXT | NOT NULL | User's full name |
| email | TEXT | NOT NULL, UNIQUE | User's email |
| password | TEXT | NOT NULL | Hashed password |
| role | TEXT | NOT NULL, DEFAULT 'user' | 'user' or 'admin' |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation time |

### items
Stores lost and found item reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| user_id | TEXT | FOREIGN KEY | Reference to users |
| title | TEXT | NOT NULL | Item name |
| category | TEXT | NOT NULL | Item category |
| color | TEXT | | Item color |
| brand | TEXT | | Item brand |
| description | TEXT | | Detailed description |
| location | TEXT | NOT NULL | Where item was lost/found |
| status | TEXT | NOT NULL | 'lost' or 'found' |
| date_reported | DATE | NOT NULL | Date of loss/find |
| image_url | TEXT | | Path to uploaded image |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- `idx_items_location` - For location-based queries
- `idx_items_category` - For category filtering
- `idx_items_status` - For status filtering
- `idx_items_user_id` - For user-specific queries

### item_matches
Stores automatic matches between lost and found items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| lost_item_id | TEXT | FOREIGN KEY | Reference to lost item |
| found_item_id | TEXT | FOREIGN KEY | Reference to found item |
| score | INTEGER | NOT NULL | Match confidence (0-100) |
| status | TEXT | NOT NULL, DEFAULT 'suggested' | Match status |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Match creation time |

**Unique Constraint:**
- `(lost_item_id, found_item_id)` - Prevents duplicate matches

**Indexes:**
- `idx_item_matches_lost` - For lost item lookups
- `idx_item_matches_found` - For found item lookups
- `idx_item_matches_status` - For status filtering

### item_claims
Stores user claims on found items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| item_id | TEXT | FOREIGN KEY | Reference to claimed item |
| user_id | TEXT | FOREIGN KEY | Reference to claimant |
| status | TEXT | NOT NULL, DEFAULT 'pending' | Claim status |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Claim creation time |

**Indexes:**
- `idx_item_claims_item` - For item lookups
- `idx_item_claims_user` - For user lookups
- `idx_item_claims_status` - For status filtering

### notifications
Stores user notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| user_id | TEXT | FOREIGN KEY | Reference to user |
| title | TEXT | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation time |

**Indexes:**
- `idx_notifications_user` - For user notifications
- `idx_notifications_read` - For unread filtering

## Relationships

```
users (1) ────< items (many)
items (1) ────< item_matches (many)
items (1) ────< item_claims (many)
users (1) ────< item_claims (many)
users (1) ────< notifications (many)
```

## Query Optimization

- Composite indexes for common query patterns
- Foreign key constraints for data integrity
- Pagination support for large datasets
