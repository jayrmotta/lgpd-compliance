/**
 * Environment validation utility
 * Validates required environment variables on application startup
 */

interface EnvironmentConfig {
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NODE_ENV: string;
  DATABASE_PATH?: string;
  PORT?: string;
  LOG_LEVEL?: string;
}

/**
 * Validate environment configuration
 */
export function validateEnvironment(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_PATH: process.env.DATABASE_PATH,
    PORT: process.env.PORT,
    LOG_LEVEL: process.env.LOG_LEVEL
  };

  const errors: string[] = [];

  // Validate JWT configuration
  if (!config.JWT_SECRET) {
    errors.push('JWT_SECRET environment variable is required');
  } else if (config.NODE_ENV === 'production' && config.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long in production');
  }

  // Validate JWT expiration
  const validExpirationFormats = ['s', 'm', 'h', 'd'];
  const expirationUnit = config.JWT_EXPIRES_IN.slice(-1);
  if (!validExpirationFormats.includes(expirationUnit)) {
    errors.push('JWT_EXPIRES_IN must be in format: <number><unit> (e.g., 24h, 30m, 7d)');
  }

  // Validate NODE_ENV
  const validEnvironments = ['development', 'production', 'test'];
  if (!validEnvironments.includes(config.NODE_ENV)) {
    errors.push(`NODE_ENV must be one of: ${validEnvironments.join(', ')}`);
  }

  // Validate PORT if provided
  if (config.PORT) {
    const port = parseInt(config.PORT, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push('PORT must be a valid port number (1-65535)');
    }
  }

  // Validate LOG_LEVEL if provided
  if (config.LOG_LEVEL) {
    const validLogLevels = ['debug', 'info', 'warn', 'error'];
    if (!validLogLevels.includes(config.LOG_LEVEL)) {
      errors.push(`LOG_LEVEL must be one of: ${validLogLevels.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  return config;
}

/**
 * Get environment configuration with validation
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return validateEnvironment();
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}
