import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 1, description: 'Sport ID the class belongs to' })
  @IsInt()
  sportId: number;

  @ApiProperty({ example: 'Advanced dribbling techniques' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  duration: number;
}
