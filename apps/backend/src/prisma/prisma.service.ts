import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type PrismaWithBeforeExit = PrismaClient & {
  $on(event: 'beforeExit', callback: () => void): void;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication): void {
    const prisma = this as unknown as PrismaWithBeforeExit;
    prisma.$on('beforeExit', () => {
      void app.close();
    });
  }
}
