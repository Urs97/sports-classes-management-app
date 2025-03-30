import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1, description: 'Class ID to enroll in' })
  @IsInt()
  classId: number;
}
