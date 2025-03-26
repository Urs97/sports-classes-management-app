import { IsNumber } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  classId: number;
}
