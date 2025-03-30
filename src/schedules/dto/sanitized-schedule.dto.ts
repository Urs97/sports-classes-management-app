import { ApiProperty } from '@nestjs/swagger';

export class SanitizedScheduleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2024-04-01T10:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: 60 })
  duration: number;
}
