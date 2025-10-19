import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  @IsNotEmpty()
  serviceId: number;

  @IsDateString()
  scheduleDate: Date;
}
