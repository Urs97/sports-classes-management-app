import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: 1, description: 'Class ID this schedule belongs to' })
  @IsInt()
  classId: number;

  @ApiProperty({ example: '2024-04-01T10:00:00.000Z' })
  @IsDateString()
  date: Date;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  duration: number;
}
