import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NumberIdDto {
  @ApiProperty({ example: 1, description: 'Numeric ID' })
  @IsNumber({}, { message: 'ID must be a number' })
  @Type(() => Number)
  id: number;
}
