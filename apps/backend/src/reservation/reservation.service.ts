// src/reservation/reservation.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reservation, ReservationStatus, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async createReservation(
    data: CreateReservationDto,
    client: SafeUser,
  ): Promise<Reservation> {
    // Busca o serviço e o cliente diretamente do banco (para garantir saldo atualizado)
    const [service, clientDB] = await Promise.all([
      this.prisma.service.findUnique({
        where: { id: data.serviceId },
      }),
      this.prisma.user.findUnique({
        where: { id: client.id },
      }),
    ]);

    if (!service) {
      throw new NotFoundException(
        'Serviço solicitado não foi encontrado (404).',
      );
    }

    if (!clientDB) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    // Verifica se o provedor de serviço existe e tem o papel correto
    const serviceProvider = await this.prisma.user.findUnique({
      where: { id: service.providerId },
    });

    if (!serviceProvider || serviceProvider.role !== Role.PROVIDER) {
      throw new NotFoundException(
        'O provedor de serviço associado não é válido.',
      );
    }

    // Impede que o provedor reserve o próprio serviço
    if (service.providerId === clientDB.id) {
      throw new ForbiddenException(
        'Você não pode reservar seu próprio serviço.',
      );
    }

    const servicePrice = service.price;

    if (clientDB.balance < servicePrice) {
      throw new BadRequestException(
        'Saldo insuficiente para reservar o serviço.',
      );
    }

    try {
      const createdReservation = await this.prisma.$transaction(async (tx) => {
        // 1️⃣ Debita o saldo do cliente
        await tx.user.update({
          where: { id: clientDB.id },
          data: { balance: { decrement: servicePrice } },
        });

        // 2️⃣ Credita o saldo ao provedor
        await tx.user.update({
          where: { id: service.providerId },
          data: { balance: { increment: servicePrice } },
        });

        // 3️⃣ Cria a reserva
        const reservation = await tx.reservation.create({
          data: {
            clientId: clientDB.id,
            serviceId: service.id,
            providerId: service.providerId,
            price: servicePrice,
            status: ReservationStatus.ACTIVE,
          },
        });

        // 4️⃣ Registra a transação financeira
        await tx.transaction.create({
          data: {
            reservationId: reservation.id,
            fromUserId: clientDB.id,
            toUserId: service.providerId,
            amount: servicePrice,
            type: 'RESERVE',
          },
        });

        return reservation;
      });

      return createdReservation;
    } catch (error) {
      console.error('Transação de Reserva Falhou:', error);
      throw new BadRequestException(
        'Falha na transação atômica. Nenhuma alteração foi salva.',
      );
    }
  }

  async cancelReservation(
    reservationId: number,
    userId: number,
  ): Promise<Reservation> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { provider: true },
    });

    if (!reservation) {
      throw new NotFoundException(
        `Reserva com ID ${reservationId} não encontrada.`,
      );
    }

    if (userId !== reservation.clientId && userId !== reservation.providerId) {
      throw new ForbiddenException(
        'Você não tem permissão para cancelar esta reserva.',
      );
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Esta reserva já foi cancelada.');
    }

    if (!reservation.provider) {
      throw new NotFoundException('Provedor da reserva não encontrado.');
    }

    const refundAmount = reservation.price;

    if (reservation.provider.balance < refundAmount) {
      throw new BadRequestException(
        'O prestador não possui saldo suficiente para o estorno.',
      );
    }

    try {
      const [, , updatedReservation] = await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: reservation.clientId },
          data: { balance: { increment: refundAmount } },
        }),
        this.prisma.user.update({
          where: { id: reservation.providerId },
          data: { balance: { decrement: refundAmount } },
        }),
        this.prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            status: ReservationStatus.CANCELLED,
            cancelledAt: new Date(),
          },
        }),
        this.prisma.transaction.create({
          data: {
            reservationId: reservation.id,
            fromUserId: reservation.providerId,
            toUserId: reservation.clientId,
            amount: refundAmount,
            type: 'REFUND',
          },
        }),
      ]);

      return updatedReservation;
    } catch (error) {
      console.error('Transação de Cancelamento Falhou:', error);
      throw new BadRequestException(
        'Falha na transação atômica de estorno. Nenhuma alteração foi salva.',
      );
    }
  }
}
