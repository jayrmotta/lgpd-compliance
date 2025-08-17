#!/usr/bin/env node

const { hash } = require('bcryptjs');
const { randomBytes } = require('crypto');
const path = require('path');
const sqlite3 = require('sqlite3');
const { promisify } = require('util');
const readline = require('readline');

/**
 * CLI script to create super admin with command line arguments or interactive mode
 * 
 * Usage:
 *   npm run create-super-admin -- --email admin@platform.com --password MySecurePass123!
 *   npm run create-super-admin (interactive mode)
 */

class SuperAdminCreator {
  constructor() {
    this.db = null;
    this.dbRun = null;
    this.dbGet = null;
  }

  async initializeDatabase() {
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'lgpd_compliance.db');
    this.db = new sqlite3.Database(dbPath);
    
    this.dbRun = promisify(this.db.run.bind(this.db));
    this.dbGet = promisify(this.db.get.bind(this.db));

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
  }

  async closeDatabase() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }
      
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  }

  async checkExistingSuperAdmin() {
    const existing = await this.dbGet(`
      SELECT COUNT(*) as count FROM users WHERE role = 'super_admin'
    `);
    
    return existing.count > 0;
  }

  async checkEmailExists(email) {
    const existing = await this.dbGet(`
      SELECT id FROM users WHERE email = ?
    `, [email.toLowerCase()]);
    
    return !!existing;
  }

  parseArguments() {
    const args = process.argv.slice(2);
    const parsed = {};
    
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--email' && i + 1 < args.length) {
        parsed.email = args[i + 1];
        i++;
      } else if (args[i] === '--password' && i + 1 < args.length) {
        parsed.password = args[i + 1];
        i++;
      } else if (args[i] === '--help' || args[i] === '-h') {
        parsed.help = true;
      }
    }
    
    return parsed;
  }

  showHelp() {
    console.log('🔐 LGPD Platform - Super Admin Account Creator');
    console.log('===============================================\n');
    console.log('Usage:');
    console.log('  npm run create-super-admin -- --email <email> --password <password>');
    console.log('  npm run create-super-admin (interactive mode)\n');
    console.log('Arguments:');
    console.log('  --email <email>       Super admin email address');
    console.log('  --password <password> Super admin password (min 8 chars, uppercase, lowercase, special char)');
    console.log('  --help, -h           Show this help message\n');
    console.log('Examples:');
    console.log('  npm run create-super-admin -- --email admin@platform.com --password MySecurePass123!');
    console.log('  npm run create-super-admin\n');
    console.log('Security Notes:');
    console.log('  - Only one super admin account is allowed');
    console.log('  - Super admin can create company representative accounts');
    console.log('  - Use a strong password and store it securely');
  }

  async promptSecurely(question, hidden = false) {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      if (hidden && process.stdin.isTTY) {
        // Hide password input in interactive mode
        const stdin = process.openStdin();
        process.stdout.write(question);
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        
        let password = '';
        stdin.on('data', function(char) {
          char = char + '';
          switch(char) {
            case '\n':
            case '\r':
            case '\u0004':
              stdin.setRawMode(false);
              stdin.pause();
              process.stdout.write('\n');
              rl.close();
              resolve(password);
              break;
            case '\u0003':
              process.stdout.write('\n');
              process.exit();
              break;
            case '\u007f': // Backspace
              if (password.length > 0) {
                password = password.slice(0, -1);
                process.stdout.write('\b \b');
              }
              break;
            default:
              password += char;
              process.stdout.write('*');
              break;
          }
        });
      } else {
        rl.question(question, (answer) => {
          rl.close();
          resolve(answer.trim());
        });
      }
    });
  }

  generateUserId() {
    return 'user-' + Date.now() + '-' + randomBytes(4).toString('hex');
  }

  async createSuperAdmin(email, password) {
    const userId = this.generateUserId();
    const passwordHash = await hash(password, 12);
    
    await this.dbRun(`
      INSERT INTO users (id, email, password_hash, role, created_at)
      VALUES (?, ?, ?, 'super_admin', CURRENT_TIMESTAMP)
    `, [userId, email.toLowerCase(), passwordHash]);
    
    return userId;
  }

  async run() {
    try {
      const args = this.parseArguments();
      
      if (args.help) {
        this.showHelp();
        return;
      }

      console.log('🔐 LGPD Platform - Super Admin Account Creator');
      console.log('===============================================\n');

      await this.initializeDatabase();

      const hasSuperAdmin = await this.checkExistingSuperAdmin();
      if (hasSuperAdmin) {
        console.log('❌ A super admin account already exists in the system.');
        console.log('   Only one super admin account is allowed for security reasons.');
        console.log('   If you need to reset the super admin, please contact support.\n');
        process.exit(1);
      }

      let email = args.email;
      let password = args.password;

      // Interactive mode if no arguments provided
      if (!email || !password) {
        console.log('⚠️  Security Notice:');
        console.log('   - This script creates the initial platform operator account');
        console.log('   - The super admin can create company representative accounts');
        console.log('   - Choose a strong password and store it securely');
        console.log('   - This account has full platform access\n');

        if (!email) {
          while (true) {
            email = await this.promptSecurely('Super Admin Email: ');
            
            if (!email) {
              console.log('❌ Email is required\n');
              continue;
            }
            
            if (!this.validateEmail(email)) {
              console.log('❌ Please enter a valid email address\n');
              continue;
            }
            
            const emailExists = await this.checkEmailExists(email);
            if (emailExists) {
              console.log('❌ An account with this email already exists\n');
              continue;
            }
            
            break;
          }
        }

        if (!password) {
          while (true) {
            password = await this.promptSecurely('Super Admin Password: ', true);
            
            if (!password) {
              console.log('❌ Password is required\n');
              continue;
            }
            
            const passwordErrors = this.validatePassword(password);
            if (passwordErrors.length > 0) {
              console.log('❌ Password validation failed:');
              passwordErrors.forEach(error => console.log(`   - ${error}`));
              console.log('');
              continue;
            }
            
            const confirmPassword = await this.promptSecurely('Confirm Password: ', true);
            if (password !== confirmPassword) {
              console.log('❌ Passwords do not match\n');
              continue;
            }
            
            break;
          }
        }
      }

      // Validate provided arguments
      if (!this.validateEmail(email)) {
        console.log('❌ Invalid email address');
        process.exit(1);
      }

      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        console.log('❌ An account with this email already exists');
        process.exit(1);
      }

      const passwordErrors = this.validatePassword(password);
      if (passwordErrors.length > 0) {
        console.log('❌ Password validation failed:');
        passwordErrors.forEach(error => console.log(`   - ${error}`));
        process.exit(1);
      }

      // Create the account
      console.log('\n🔄 Creating super admin account...');
      const userId = await this.createSuperAdmin(email, password);
      
      console.log('✅ Super admin account created successfully!');
      console.log(`   User ID: ${userId}`);
      console.log(`   Email: ${email}`);
      console.log(`   Role: super_admin\n`);
      
      console.log('🚀 Next steps:');
      console.log('   1. Start the platform: npm run dev');
      console.log('   2. Login at http://localhost:3000/login');
      console.log('   3. Access admin panel at http://localhost:3000/admin');
      console.log('   4. Create company representative accounts');
      console.log('\n🔒 Security reminder: Store your credentials securely!');

    } catch (error) {
      console.error('❌ Error creating super admin account:', error.message);
      process.exit(1);
    } finally {
      await this.closeDatabase();
    }
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n🛑 Operation cancelled by user');
  process.exit(0);
});

const creator = new SuperAdminCreator();
creator.run().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});