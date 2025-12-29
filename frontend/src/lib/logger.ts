/**
 * Logger Service - Sistema de logging centralizado
 * Reemplaza console.log/error directo
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | any, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      } : error,
    };
    console.error(this.formatMessage('error', message, errorContext));
  }

  // Métodos específicos para el dominio
  auth = {
    login: (email: string, success: boolean) => {
      this.info('Auth: Login attempt', { email, success });
    },
    register: (email: string, success: boolean) => {
      this.info('Auth: Registration', { email, success });
    },
    logout: (userId: string) => {
      this.info('Auth: Logout', { userId });
    },
    verifyEmail: (email: string) => {
      this.info('Auth: Email verified', { email });
    },
  };

  post = {
    created: (postId: string, userId: string, isAnonymous: boolean) => {
      this.info('Post: Created', { postId, userId, isAnonymous });
    },
    error: (action: string, error: any) => {
      this.error(`Post: ${action} failed`, error);
    },
  };

  api = {
    request: (method: string, url: string, status?: number) => {
      this.debug('API: Request', { method, url, status });
    },
    error: (method: string, url: string, status: number, error: any) => {
      this.error('API: Request failed', error, { method, url, status });
    },
  };
}

export const logger = new Logger();
