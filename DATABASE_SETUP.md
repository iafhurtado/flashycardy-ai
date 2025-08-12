# Database Setup with Drizzle ORM

This project uses Drizzle ORM to connect to a Neon PostgreSQL database.

## Setup

The database connection is configured using the following components:

### Environment Variables
- `.env` file contains the `DATABASE_URL` for the Neon database connection

### Database Files
- `src/db/schema.ts` - Database schema definitions
- `src/db/index.ts` - Database connection setup
- `drizzle.config.ts` - Drizzle configuration

### Available Scripts

```bash
# Generate migration files
npm run db:generate

# Push schema changes directly to database
npm run db:push

# Apply migrations
npm run db:migrate

# Test database connection and operations
npm run db:test
```

## Database Schema

Currently, the database includes:

### Users Table
- `id` - Primary key (auto-incrementing integer)
- `name` - User's name (varchar, required)
- `age` - User's age (integer, required)
- `email` - User's email (varchar, required, unique)

## Usage Example

```typescript
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Create a user
const newUser = await db.insert(usersTable).values({
  name: 'John Doe',
  age: 25,
  email: 'john@example.com'
});

// Query users
const users = await db.select().from(usersTable);

// Update user
await db.update(usersTable)
  .set({ age: 26 })
  .where(eq(usersTable.email, 'john@example.com'));

// Delete user
await db.delete(usersTable)
  .where(eq(usersTable.email, 'john@example.com'));
```

## Connection Details

- **Database**: Neon PostgreSQL
- **Driver**: @neondatabase/serverless
- **ORM**: Drizzle ORM
- **Connection**: HTTP-based for serverless environments
