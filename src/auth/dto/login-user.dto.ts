import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'jane.doe@example.com',
    description: 'The user\'s email address',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123!',
    description: 'The user\'s password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
