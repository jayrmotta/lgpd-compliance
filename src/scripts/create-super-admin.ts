#!/usr/bin/env tsx

import { hash } from 'bcryptjs';
import readline from 'readline';
import { addUser, findUserByEmail, getAllUsers } from '@/lib/user-storage';

/**
 * CLI script to create super admin using shared application code
 * 
 * This TypeScript version ensures full compatibility with the application
 * and uses the same imports and types as the rest of the codebase.
 */

class SuperAdminCreator {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): string[] {
    const errors: string[] = [];
    
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

  async checkExistingSuperAdmin(): Promise<boolean> {
    const allUsers = await getAllUsers();
    return allUsers.some(user => user.role === 'super_admin');
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const existingUser = await findUserByEmail(email);
    return !!existingUser;
  }

  parseArguments(): { email?: string; password?: string; help?: boolean } {
    const args = process.argv.slice(2);
    const parsed: { email?: string; password?: string; help?: boolean } = {};
    
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

  showHelp(): void {
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
    console.log('  - ✅ Uses shared application code (zero duplication)');
  }

  async promptSecurely(question: string, hidden = false): Promise<string> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      if (hidden && process.stdin.isTTY) {
        const stdin = process.stdin;
        process.stdout.write(question);
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        
        let password = '';
        stdin.on('data', function(char: string) {
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
            case '\u007f':
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

  async createSuperAdmin(email: string, password: string): Promise<string> {
    // Hash password using same method as application
    const passwordHash = await hash(password, 12);
    
    // Use shared addUser function - ensures exact same logic as application
    const userId = await addUser({
      email: email.toLowerCase(),
      passwordHash,
      role: 'super_admin',
      passwordTemporary: false // Super admin passwords are never temporary
    });
    
    return userId;
  }

  async run(): Promise<void> {
    try {
      const args = this.parseArguments();
      
      if (args.help) {
        this.showHelp();
        return;
      }

      console.log('🔐 LGPD Platform - Super Admin Account Creator');
      console.log('===============================================\n');

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
      if (!this.validateEmail(email!)) {
        console.log('❌ Invalid email address');
        process.exit(1);
      }

      const emailExists = await this.checkEmailExists(email!);
      if (emailExists) {
        console.log('❌ An account with this email already exists');
        process.exit(1);
      }

      const passwordErrors = this.validatePassword(password!);
      if (passwordErrors.length > 0) {
        console.log('❌ Password validation failed:');
        passwordErrors.forEach(error => console.log(`   - ${error}`));
        process.exit(1);
      }

      // Create the account using shared application logic
      console.log('\n🔄 Creating super admin account...');
      const userId = await this.createSuperAdmin(email!, password!);
      
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
      console.error('❌ Error creating super admin account:', (error as Error).message);
      if (process.env.NODE_ENV === 'development') {
        console.error('Stack trace:', (error as Error).stack);
      }
      process.exit(1);
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