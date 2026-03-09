# API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user"
  }
}
```

### POST /api/auth/login
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user"
  }
}
```

### POST /api/auth/logout
Destroy user session.

**Response:**
```json
{
  "message": "Logout successful"
}
```

## Item Endpoints

### POST /api/items
Create a new lost or found item report.

**Request Body:**
```json
{
  "title": "string",
  "category": "string",
  "color": "string",
  "brand": "string",
  "description": "string",
  "location": "string",
  "status": "lost" | "found",
  "date_reported": "YYYY-MM-DD",
  "image_url": "string"
}
```

**Response:**
```json
{
  "message": "Item created successfully",
  "item": { ... }
}
```

### GET /api/items
Get items with optional filtering.

**Query Parameters:**
- `status` - Filter by 'lost' or 'found'
- `search` - Search in title, description, location
- `category` - Filter by category
- `location` - Filter by location
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset

**Response:**
```json
{
  "items": [ ... ],
  "total": number
}
```

### GET /api/items/[id]
Get a specific item by ID.

### PUT /api/items/[id]
Update an item (owner or admin only).

### DELETE /api/items/[id]
Delete an item (owner or admin only).

## Match Endpoints

### GET /api/matches
Get matches with optional filtering.

**Query Parameters:**
- `status` - Filter by status
- `limit` - Number of results
- `offset` - Pagination offset

### POST /api/matches/run
Run the matching engine (admin only).

### GET /api/matches/[id]
Get a specific match.

### PUT /api/matches/[id]
Update match status (admin only).

## Claim Endpoints

### POST /api/claims
Create a claim request for an item.

**Request Body:**
```json
{
  "itemId": "string"
}
```

### GET /api/claims
Get claims (user's claims or all for admin).

### PUT /api/claims/[id]
Update claim status (admin only).

## Dashboard Endpoints

### GET /api/dashboard
Get dashboard statistics (admin only).

**Response:**
```json
{
  "totalUsers": number,
  "totalLostItems": number,
  "totalFoundItems": number,
  "totalMatchedItems": number,
  "recentReports": [ ... ]
}
```
