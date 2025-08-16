// SQLite-backed user storage - replaces in-memory storage

import { 
  createUser as dbCreateUser, 
  findUserByEmail as dbFindUserByEmail, 
  getAllUsers as dbGetAllUsers, 
  clearAllUsers as dbClearAllUsers,
  type User,
  initializeDatabase,
  databaseManager
} from './database-v2';

// Ensure database is initialized
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    // Use separate database for tests
    if (process.env.NODE_ENV === 'test') {
      await databaseManager.close();
      process.env.DATABASE_PATH = ':memory:';
    }
    await initializeDatabase();
    dbInitialized = true;
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureDbInitialized();
  return await dbFindUserByEmail(email);
}

export async function addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<string> {
  await ensureDbInitialized();
  return await dbCreateUser(user);
}

export async function getAllUsers(): Promise<User[]> {
  await ensureDbInitialized();
  return await dbGetAllUsers();
}

export async function clearAllUsers(): Promise<void> {
  await ensureDbInitialized();
  await dbClearAllUsers();
}

// Export the User type for compatibility
export type { User };