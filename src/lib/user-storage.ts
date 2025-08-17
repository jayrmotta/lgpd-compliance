// SQLite-backed user storage - replaces in-memory storage

import { 
  createUser as dbCreateUser,
  updateUser as dbUpdateUser,
  findUserByEmail as dbFindUserByEmail, 
  getAllUsers as dbGetAllUsers, 
  clearAllUsers as dbClearAllUsers,
  type User,
  initializeDatabase,
  databaseManager
} from './database-v2';

// Ensure database is initialized with proper singleton pattern
let dbInitPromise: Promise<void> | null = null;

async function ensureDbInitialized() {
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      // Use separate database for tests
      if (process.env.NODE_ENV === 'test') {
        await databaseManager.close();
        process.env.DATABASE_PATH = ':memory:';
      }
      await initializeDatabase();
    })();
  }
  await dbInitPromise;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureDbInitialized();
  return await dbFindUserByEmail(email);
}

export async function addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<string> {
  await ensureDbInitialized();
  return await dbCreateUser(user);
}

export async function updateUser(user: User): Promise<void> {
  await ensureDbInitialized();
  return await dbUpdateUser(user);
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