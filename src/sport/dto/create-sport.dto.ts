import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSportDto {
  @ApiProperty({
    example: 'Basketball',
    description: 'Name of the sport to create (must be unique)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
