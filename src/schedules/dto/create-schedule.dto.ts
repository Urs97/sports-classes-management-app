import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the class this schedule is associated with',
  })
  @IsInt()
  @IsNotEmpty()
  classId: number;

  @ApiProperty({
    example: '2024-04-01T10:00:00.000Z',
    description: 'Start date and time of the scheduled session (ISO 8601 format)',
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    example: 60,
    description: 'Duration of the session in minutes',
  })
  @IsInt()
  @IsNotEmpty()
  duration: number;
}
