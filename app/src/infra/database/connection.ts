import { PrismaClient } from '@prisma/client';
import { Logger } from '@infra/logger';

export class ConnectionDb {
  private static prisma: PrismaClient;

  static async connect(): Promise<void> {
    Logger.info('📖 Connecting to database...');

    try {
      await ConnectionDb.setPrisma();

      await ConnectionDb.prisma.$connect();
      Logger.info('📚 Connected to database');
    } catch (error) {
      Logger.error('🚨 Error connecting to database');
      Logger.error(String(error));
    }
  }

  static async disconnect(): Promise<void> {
    Logger.info('🎒 Disconnecting from database...');
    await ConnectionDb.prisma.$disconnect();
  }

  static async setPrisma() {
    if (!ConnectionDb.prisma) {
      ConnectionDb.prisma = new PrismaClient();
    }
  }

  static getPrisma(): PrismaClient {
    return ConnectionDb.prisma;
  }
}
