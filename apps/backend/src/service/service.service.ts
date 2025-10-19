// src/services/service.service.ts
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReservationStatus, Service as ServiceModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateServiceDto,
    providerId: number,
  ): Promise<ServiceModel> {
    return await this.prisma.service.create({
      data: {
        ...data,
        providerId,
      },
    });
  }

  async findAll(): Promise<ServiceModel[]> {
    return await this.prisma.service.findMany();
  }

  async findOne(id: number): Promise<ServiceModel> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado.`);
    }
    return service;
  }

  async update(
    id: number,
    data: UpdateServiceDto,
    providerId: number,
  ): Promise<ServiceModel> {
    const service = await this.findOne(id);

    if (service.providerId !== providerId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este serviço.',
      );
    }

    return await this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, providerId: number): Promise<ServiceModel> {
    const service = await this.findOne(id);

    if (service.providerId !== providerId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir este serviço.',
      );
    }

    const activeReservations = await this.prisma.reservation.findFirst({
      where: {
        serviceId: id,
        status: ReservationStatus.ACTIVE,
      },
    });

    if (activeReservations) {
      throw new ConflictException(
        'Não é possível excluir o serviço: Existem reservas ativas associadas.',
      );
    }

    return await this.prisma.service.delete({ where: { id } });
  }
}
