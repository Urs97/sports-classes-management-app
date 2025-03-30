import { ApiProperty } from '@nestjs/swagger';
import { Sport } from '../../sports/entities/sport.entity';

export class SanitizedClassDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: () => Sport })
  sport: Sport;

  @ApiProperty({ example: 'Beginner football techniques' })
  description: string;

  @ApiProperty({ example: 90 })
  duration: number;
}
