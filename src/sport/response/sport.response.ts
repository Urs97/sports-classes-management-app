import { ApiProperty } from '@nestjs/swagger';
import { ISportRecord } from '../interface/sport.interface';

export class SportResponse implements ISportRecord {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Basketball' })
  name: string;
}
