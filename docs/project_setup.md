# Project Setup

## Prerequisites

- Node.js 18+
- npm or yarn
- Turso account (for database)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lfms
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## Database Setup

The database schema is automatically initialized when the first API request is made. The schema includes:

- users table
- items table
- item_matches table
- item_claims table
- notifications table

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Build

Create a production build:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
lfms/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── items/           # Item-related components
│   └── dashboard/       # Dashboard components
├── lib/                  # Core libraries
│   ├── db/              # Database connection
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── matching-engine/ # Matching algorithm
├── types/               # TypeScript types
├── database/            # SQL schemas
└── docs/                # Documentation
```

## User Roles

### Normal Users
- Register and login
- Report lost items
- Report found items
- Browse items
- View matches
- Claim items

### Administrators
- All user permissions
- View dashboard statistics
- Run matching engine
- Manage claims (approve/reject)
- Manage match status

## Creating an Admin User

Currently, admin users must be created manually in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Turso** - Database
- **bcryptjs** - Password hashing
- **libSQL** - Database client
- **uuid** - ID generation
