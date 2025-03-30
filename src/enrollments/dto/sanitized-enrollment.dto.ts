import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';

export class SanitizedEnrollmentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Class })
  class: Class;

  @ApiProperty({ example: '2024-03-29T12:34:56.000Z' })
  enrolledAt: Date;
}
