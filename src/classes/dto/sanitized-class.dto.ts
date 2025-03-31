import { ApiProperty } from '@nestjs/swagger';
import { SanitizedSportDto } from '../../sports/dto/sanitized-sport.dto';

export class SanitizedClassDto {
  @ApiProperty({
    example: 1,
    description: 'Unique ID of the class',
  })
  id: number;

  @ApiProperty({
    type: () => SanitizedSportDto,
    description: 'Sport associated with this class',
  })
  sport: SanitizedSportDto;

  @ApiProperty({
    example: 'Beginner football techniques',
    description: 'Description of the class',
  })
  description: string;

  @ApiProperty({
    example: 90,
    description: 'Class duration in minutes',
  })
  duration: number;
}
