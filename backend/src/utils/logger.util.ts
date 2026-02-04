/**
 * Logger Utility
 * Centralized logging for observability
 * Production-ready with timestamps and levels
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  error(message: string, error?: Error | any): void {
    const meta = error instanceof Error
      ? { message: error.message, stack: error.stack }
      : error;
    console.error(this.formatMessage(LogLevel.ERROR, message, meta));
  }

  warn(message: string, meta?: any): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, meta));
  }

  info(message: string, meta?: any): void {
    console.log(this.formatMessage(LogLevel.INFO, message, meta));
  }

  debug(message: string, meta?: any): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }

  // Request logging
  request(method: string, path: string, statusCode: number, duration: number): void {
    const level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    const message = `${method} ${path} ${statusCode} ${duration}ms`;
    
    if (level === LogLevel.ERROR) {
      console.error(this.formatMessage(level, message));
    } else if (level === LogLevel.WARN) {
      console.warn(this.formatMessage(level, message));
    } else {
      console.log(this.formatMessage(level, message));
    }
  }
}

export const logger = new Logger();
