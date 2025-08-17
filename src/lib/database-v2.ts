import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

// Types based on Gherkin scenarios
export type LGPDRequestType = 'ACCESS' | 'DELETION' | 'CORRECTION' | 'PORTABILITY';
export type LGPDRequestStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface LGPDRequest {
  id: string;
  user_id: string;
  company_id: string;
  type: LGPDRequestType;
  status: LGPDRequestStatus;
  reason: string;
  description: string;
  cpf_hash: string; // Hashed CPF for privacy
  pix_transaction_hash?: string;
  created_at: Date;
  response_due_at: Date;
  completed_at?: Date;
}

export interface EncryptedLGPDData {
  id: string;
  request_id: string;
  encrypted_blob: Buffer; // Sealed box encrypted data
  public_key_fingerprint: string; // Company's public key fingerprint
  created_at: Date;
}

export interface Company {
  id: string;
  name: string;
  public_key: string;
  created_at: Date;
  is_active: boolean;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'data_subject' | 'super_admin' | 'admin' | 'employee';
  createdAt: Date;
  companyId?: string;
}

/**
 * Database connection manager
 */
export class DatabaseManager {
  private db: sqlite3.Database | null = null;
  private dbRun: ((sql: string, params?: unknown[]) => Promise<sqlite3.RunResult>) | null = null;
  private dbGet: ((sql: string, params?: unknown[]) => Promise<unknown>) | null = null;
  private dbAll: ((sql: string, params?: unknown[]) => Promise<unknown[]>) | null = null;

  async initialize(): Promise<void> {
    if (this.db) {
      await this.close();
    }

    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'lgpd_compliance.db');
    this.db = new sqlite3.Database(dbPath);
    
    // Promisify database methods for async/await usage
    this.dbRun = promisify(this.db.run.bind(this.db));
    this.dbGet = promisify(this.db.get.bind(this.db));
    this.dbAll = promisify(this.db.all.bind(this.db));

    await this.createTables();
    if (process.env.NODE_ENV === 'development') {
      console.log('Database initialized successfully');
    }
  }

  private async createTables(): Promise<void> {
    if (!this.dbRun) throw new Error('Database not initialized');

    try {
      // Users table
      await this.dbRun(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('data_subject', 'super_admin', 'admin', 'employee')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          company_id TEXT
        )
      `);

      // Companies table
      await this.dbRun(`
        CREATE TABLE IF NOT EXISTS companies (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          public_key TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT 1
        )
      `);

      // LGPD requests table (metadata only - zero knowledge operator)
      await this.dbRun(`
        CREATE TABLE IF NOT EXISTS lgpd_requests (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          company_id TEXT NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('ACCESS', 'DELETION', 'CORRECTION', 'PORTABILITY')),
          status TEXT NOT NULL CHECK(status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
          reason TEXT NOT NULL,
          description TEXT NOT NULL,
          cpf_hash TEXT NOT NULL,
          pix_transaction_hash TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          response_due_at DATETIME NOT NULL,
          completed_at DATETIME,
          FOREIGN KEY (company_id) REFERENCES companies (id)
        )
      `);

      // Encrypted data table (opaque blobs)
      await this.dbRun(`
        CREATE TABLE IF NOT EXISTS encrypted_lgpd_data (
          id TEXT PRIMARY KEY,
          request_id TEXT NOT NULL,
          encrypted_blob BLOB NOT NULL,
          public_key_fingerprint TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (request_id) REFERENCES lgpd_requests (id)
        )
      `);

      // Indexes for performance
      await this.dbRun('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)');
      await this.dbRun('CREATE INDEX IF NOT EXISTS idx_requests_user_id ON lgpd_requests (user_id)');
      await this.dbRun('CREATE INDEX IF NOT EXISTS idx_requests_company_id ON lgpd_requests (company_id)');
      await this.dbRun('CREATE INDEX IF NOT EXISTS idx_requests_status ON lgpd_requests (status)');
      await this.dbRun('CREATE INDEX IF NOT EXISTS idx_encrypted_data_request_id ON encrypted_lgpd_data (request_id)');
    } catch (error) {
      console.error('Database table creation failed:', error);
      throw error;
    }
  }

  async createLGPDRequest(request: Omit<LGPDRequest, 'id' | 'created_at' | 'response_due_at'>): Promise<string> {
    if (!this.dbRun) throw new Error('Database not initialized');

    const id = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const created_at = new Date();
    const response_due_at = new Date(created_at.getTime() + (15 * 24 * 60 * 60 * 1000)); // 15 days from creation

    await this.dbRun(`
      INSERT INTO lgpd_requests (
        id, user_id, company_id, type, status, reason, description, 
        cpf_hash, pix_transaction_hash, created_at, response_due_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, request.user_id, request.company_id, request.type, request.status,
      request.reason, request.description, request.cpf_hash, request.pix_transaction_hash,
      created_at.toISOString(), response_due_at.toISOString()
    ]);

    return id;
  }

  async storeEncryptedLGPDData(
    requestId: string,
    encryptedBlob: Buffer,
    publicKeyFingerprint: string
  ): Promise<string> {
    if (!this.dbRun) throw new Error('Database not initialized');

    const id = `ENC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await this.dbRun(`
      INSERT INTO encrypted_lgpd_data (id, request_id, encrypted_blob, public_key_fingerprint)
      VALUES (?, ?, ?, ?)
    `, [id, requestId, encryptedBlob, publicKeyFingerprint]);

    return id;
  }

  async getUserLGPDRequests(userId: string): Promise<LGPDRequest[]> {
    if (!this.dbAll) throw new Error('Database not initialized');

    const rows = await this.dbAll(`
      SELECT * FROM lgpd_requests 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (rows as any[]).map((row: Record<string, any>) => ({
      id: row.id,
      user_id: row.user_id,
      company_id: row.company_id,
      type: row.type as LGPDRequestType,
      status: row.status as LGPDRequestStatus,
      reason: row.reason,
      description: row.description,
      cpf_hash: row.cpf_hash,
      pix_transaction_hash: row.pix_transaction_hash,
      created_at: new Date(row.created_at),
      response_due_at: new Date(row.response_due_at),
      completed_at: row.completed_at ? new Date(row.completed_at) : undefined
    }));
  }

  async getCompanyLGPDRequests(companyId: string): Promise<LGPDRequest[]> {
    if (!this.dbAll) throw new Error('Database not initialized');

    const rows = await this.dbAll(`
      SELECT * FROM lgpd_requests 
      WHERE company_id = ? 
      ORDER BY created_at DESC
    `, [companyId]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (rows as any[]).map((row: Record<string, any>) => ({
      id: row.id,
      user_id: row.user_id,
      company_id: row.company_id,
      type: row.type as LGPDRequestType,
      status: row.status as LGPDRequestStatus,
      reason: row.reason,
      description: row.description,
      cpf_hash: row.cpf_hash,
      pix_transaction_hash: row.pix_transaction_hash,
      created_at: new Date(row.created_at),
      response_due_at: new Date(row.response_due_at),
      completed_at: row.completed_at ? new Date(row.completed_at) : undefined
    }));
  }

  async getEncryptedLGPDData(requestId: string): Promise<EncryptedLGPDData | null> {
    if (!this.dbGet) throw new Error('Database not initialized');

    const row = await this.dbGet(`
      SELECT * FROM encrypted_lgpd_data 
      WHERE request_id = ?
    `, [requestId]) as Record<string, unknown>;

    if (!row) return null;

    return {
      id: row.id as string,
      request_id: row.request_id as string,
      encrypted_blob: row.encrypted_blob as Buffer,
      public_key_fingerprint: row.public_key_fingerprint as string,
      created_at: new Date(row.created_at as string)
    };
  }

  async updateRequestStatus(
    requestId: string, 
    status: LGPDRequestStatus, 
    completedAt?: Date
  ): Promise<void> {
    if (!this.dbRun) throw new Error('Database not initialized');

    if (status === 'COMPLETED' && completedAt) {
      await this.dbRun(`
        UPDATE lgpd_requests 
        SET status = ?, completed_at = ? 
        WHERE id = ?
      `, [status, completedAt.toISOString(), requestId]);
    } else {
      await this.dbRun(`
        UPDATE lgpd_requests 
        SET status = ? 
        WHERE id = ?
      `, [status, requestId]);
    }
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<string> {
    if (!this.dbRun) throw new Error('Database not initialized');

    const id = `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date();

    await this.dbRun(`
      INSERT INTO users (id, email, password_hash, role, created_at, company_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, user.email, user.passwordHash, user.role, createdAt.toISOString(), user.companyId || null]);

    return id;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    if (!this.dbGet) throw new Error('Database not initialized');

    const row = await this.dbGet(`
      SELECT * FROM users WHERE email = ? COLLATE NOCASE
    `, [email]) as Record<string, unknown>;

    if (!row) return null;

    return {
      id: row.id as string,
      email: row.email as string,
      passwordHash: row.password_hash as string,
      role: row.role as 'data_subject' | 'super_admin' | 'admin' | 'employee',
      createdAt: new Date(row.created_at as string),
      companyId: (row.company_id as string) || undefined
    };
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.dbAll) throw new Error('Database not initialized');

    const rows = await this.dbAll(`
      SELECT * FROM users ORDER BY created_at DESC
    `);

    return (rows as Record<string, unknown>[]).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      email: row.email as string,
      passwordHash: row.password_hash as string,
      role: row.role as 'data_subject' | 'super_admin' | 'admin' | 'employee',
      createdAt: new Date(row.created_at as string),
      companyId: (row.company_id as string) || undefined
    }));
  }

  async clearAllUsers(): Promise<void> {
    if (!this.dbRun) throw new Error('Database not initialized');
    await this.dbRun('DELETE FROM users');
  }

  async getCompanyPublicKey(companyId: string): Promise<string> {
    if (!this.dbGet) throw new Error('Database not initialized');

    const company = await this.dbGet(`
      SELECT public_key FROM companies WHERE id = ? AND is_active = 1
    `, [companyId]) as Record<string, unknown>;

    if (!company) {
      throw new Error('Company not found or inactive');
    }

    return company.public_key as string;
  }

  async createDemoCompany(): Promise<string> {
    if (!this.dbRun || !this.dbGet) throw new Error('Database not initialized');

    const id = 'COMPANY-DEMO-TECHCORP';
    
    try {
      // Check if company already exists with real keys
      const existing = await this.dbGet(`
        SELECT public_key FROM companies WHERE id = ?
      `, [id]) as Record<string, unknown>;

      if (existing && (existing.public_key as string) !== 'DEMO_PUBLIC_KEY_TO_BE_REPLACED') {
        return id; // Company already exists with real keys
      }

      // Get or generate public key (private key managed client-side only)
      const { getOrGenerateDemoPublicKey } = await import('@/lib/crypto');
      const publicKey = await getOrGenerateDemoPublicKey();
      
      await this.dbRun(`
        INSERT OR REPLACE INTO companies (id, name, public_key, is_active)
        VALUES (?, ?, ?, ?)
      `, [id, 'TechCorp Ltd', publicKey, true]);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Demo company created with real encryption keys');
      }
      return id;
    } catch (error) {
      console.error('Failed to create demo company:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }
      
      this.db.close((err) => {
        if (err) reject(err);
        else {
          // Reset connection variables
          this.db = null;
          this.dbRun = null;
          this.dbGet = null;
          this.dbAll = null;
          resolve();
        }
      });
    });
  }
}

// Singleton instance for application use
export const databaseManager = new DatabaseManager();

// Export convenience functions that use the singleton
export const initializeDatabase = () => databaseManager.initialize();
export const createLGPDRequest = (request: Omit<LGPDRequest, 'id' | 'created_at' | 'response_due_at'>) => 
  databaseManager.createLGPDRequest(request);
export const storeEncryptedLGPDData = (requestId: string, encryptedBlob: Buffer, publicKeyFingerprint: string) =>
  databaseManager.storeEncryptedLGPDData(requestId, encryptedBlob, publicKeyFingerprint);
export const getUserLGPDRequests = (userId: string) => databaseManager.getUserLGPDRequests(userId);
export const getCompanyLGPDRequests = (companyId: string) => databaseManager.getCompanyLGPDRequests(companyId);
export const getEncryptedLGPDData = (requestId: string) => databaseManager.getEncryptedLGPDData(requestId);
export const updateRequestStatus = (requestId: string, status: LGPDRequestStatus, completedAt?: Date) =>
  databaseManager.updateRequestStatus(requestId, status, completedAt);
export const createDemoCompany = () => databaseManager.createDemoCompany();
export const getCompanyPublicKey = (companyId: string) => databaseManager.getCompanyPublicKey(companyId);
export const closeDatabase = () => databaseManager.close();

// User management functions
export const createUser = (user: Omit<User, 'id' | 'createdAt'>) => databaseManager.createUser(user);
export const findUserByEmail = (email: string) => databaseManager.findUserByEmail(email);
export const getAllUsers = () => databaseManager.getAllUsers();
export const clearAllUsers = () => databaseManager.clearAllUsers();
