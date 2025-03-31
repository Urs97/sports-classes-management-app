import { ApiProperty } from '@nestjs/swagger';

export class SanitizedScheduleDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the schedule entry',
  })
  id: number;

  @ApiProperty({
    example: '2024-04-01T10:00:00.000Z',
    description: 'Start time of the scheduled session (ISO 8601)',
  })
  date: Date;

  @ApiProperty({
    example: 60,
    description: 'Session duration in minutes',
  })
  duration: number;
}
