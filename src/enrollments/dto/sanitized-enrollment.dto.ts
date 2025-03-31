import { ApiProperty } from '@nestjs/swagger';
import { SanitizedUserDto } from '../../users/dto/sanitized-user.dto';
import { SanitizedClassDto } from '../../classes/dto/sanitized-class.dto';

export class SanitizedEnrollmentDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the enrollment record',
  })
  id: number;

  @ApiProperty({
    type: () => SanitizedUserDto,
    description: 'User who enrolled in the class',
  })
  user: SanitizedUserDto;

  @ApiProperty({
    type: () => SanitizedClassDto,
    description: 'Class the user is enrolled in',
  })
  class: SanitizedClassDto;

  @ApiProperty({
    example: '2024-03-29T12:34:56.000Z',
    description: 'Timestamp when the enrollment occurred (ISO 8601 format)',
  })
  enrolledAt: Date;
}
