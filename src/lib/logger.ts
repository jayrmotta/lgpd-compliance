// Centralized logging utility

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  private log(level: LogLevel, message: string, context?: LogContext): void {
    // In production, only log errors and warnings
    if (!this.isDevelopment && !['error', 'warn'].includes(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      environment: this.isDevelopment ? 'development' : 'production',
      side: this.isClient ? 'client' : 'server',
      ...context
    };

    // Use appropriate console method
    const consoleMethod = console[level] || console.log;
    
    if (this.isDevelopment) {
      // Pretty print in development
      consoleMethod(`[${level.toUpperCase()}] ${message}`, context || '');
    } else {
      // Structured logging for production
      consoleMethod(JSON.stringify(logData));
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined
      } : error
    };
    
    this.log('error', message, errorContext);
  }

  // Security-focused logging
  securityEvent(event: string, context?: LogContext): void {
    this.warn(`SECURITY: ${event}`, { ...context, type: 'security' });
  }

  // Auth-focused logging
  authEvent(event: string, context?: LogContext): void {
    this.info(`AUTH: ${event}`, { ...context, type: 'auth' });
  }
}

export const logger = new Logger();
export default logger;