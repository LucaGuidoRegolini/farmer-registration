import { ErrorInterface } from '@infra/errors';
import winston, { LogCallback } from 'winston';

export class Logger {
  private logger: winston.Logger;
  static init(): winston.Logger {
    if (this.prototype.logger !== undefined) {
      return this.prototype.logger;
    }

    let logger: winston.Logger;

    logger = winston.createLogger({
      transports: [new winston.transports.Console()],
    });

    this.prototype.logger = logger;
    return logger;
  }

  static info(message: string, callback?: LogCallback): void {
    this.prototype.logger.info(message, callback);
  }

  static error(message: string | ErrorInterface, ...meta: any[]): void {
    this.prototype.logger.error(message.toString(), meta);
  }

  static warn(message: string, ...meta: any[]): void {
    this.prototype.logger.warn(message, meta);
  }
}
