import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { usersTable } from './schema';

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Create a new user
    const user: typeof usersTable.$inferInsert = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    };
    
    await db.insert(usersTable).values(user);
    console.log('✅ New user created!');
    
    // Get all users
    const users = await db.select().from(usersTable);
    console.log('✅ Getting all users from the database:', users);
    
    // Update user
    await db
      .update(usersTable)
      .set({
        age: 31,
      })
      .where(eq(usersTable.email, user.email));
    console.log('✅ User info updated!');
    
    // Delete user
    await db.delete(usersTable).where(eq(usersTable.email, user.email));
    console.log('✅ User deleted!');
    
    console.log('🎉 All database operations completed successfully!');
  } catch (error) {
    console.error('❌ Database operation failed:', error);
  }
}

main();
