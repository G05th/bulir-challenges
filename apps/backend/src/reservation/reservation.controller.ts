import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reservation, Role, User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservation.service';

type SafeUser = Omit<User, 'password'>;

interface AuthRequest extends ExpressRequest {
  user: SafeUser;
}

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLIENT)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req: AuthRequest,
  ): Promise<Reservation> {
    return this.reservationService.createReservation(
      createReservationDto,
      req.user,
    );
  }

  @Delete(':id/cancel')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLIENT, Role.PROVIDER)
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ): Promise<Reservation> {
    return this.reservationService.cancelReservation(id, req.user.id);
  }
}
