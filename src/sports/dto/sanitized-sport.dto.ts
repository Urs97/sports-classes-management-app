import { ApiProperty } from '@nestjs/swagger';

export class SanitizedSportDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Football' })
  name: string;
}
