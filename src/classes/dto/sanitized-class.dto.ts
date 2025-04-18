import { ApiProperty } from '@nestjs/swagger';
import { SportResponse } from '../../sport/response/sport.response';

export class SanitizedClassDto {
  @ApiProperty({
    example: 1,
    description: 'Unique ID of the class',
  })
  id: number;

  @ApiProperty({
    type: () => SportResponse,
    description: 'Sport associated with this class',
  })
  sport: SportResponse;

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
