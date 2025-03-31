import { ApiProperty } from '@nestjs/swagger';

export class SanitizedSportDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the sport',
  })
  id: number;

  @ApiProperty({
    example: 'Football',
    description: 'Name of the sport',
  })
  name: string;
}
