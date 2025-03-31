import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the class the user wants to enroll in',
  })
  @IsInt()
  classId: number;
}
