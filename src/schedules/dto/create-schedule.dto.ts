import { IsDateString, IsNumber } from 'class-validator';

export class CreateScheduleDto {
  @IsNumber()
  classId: number;

  @IsDateString()
  date: string;

  @IsNumber()
  duration: number;
}
