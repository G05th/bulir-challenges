import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReservationModule } from './reservation/reservation.module';
import { ServiceController } from './service/service.controller';
import { ServiceModule } from './service/service.module';
import { ServiceService } from './service/service.service';

@Module({
  imports: [AuthModule, ReservationModule, ServiceModule, PrismaModule],
  controllers: [AppController, ServiceController],
  providers: [AppService, ServiceService],
})
export class AppModule {}
