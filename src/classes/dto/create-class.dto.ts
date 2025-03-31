import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the sport this class is associated with',
  })
  @IsInt()
  sportId: number;

  @ApiProperty({
    example: 'Advanced dribbling techniques',
    description: 'Description of the class content',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 60,
    description: 'Duration of the class in minutes',
  })
  @IsInt()
  duration: number;
}
