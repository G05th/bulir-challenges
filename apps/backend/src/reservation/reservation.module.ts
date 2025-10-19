// src/reservation/reservation.module.ts

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
