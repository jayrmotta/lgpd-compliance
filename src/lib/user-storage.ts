// In-memory user storage (for development only - replace with database in production)

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  userType: 'data_subject' | 'company_representative';
  createdAt: Date;
}

// In-memory storage - this will be reset on server restart
const users: User[] = [];

export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function addUser(user: User): void {
  users.push(user);
}

export function getAllUsers(): User[] {
  return users;
}

export function clearAllUsers(): void {
  users.length = 0;
}