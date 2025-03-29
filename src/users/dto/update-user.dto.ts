import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Optional role to assign to the user',
    example: UserRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Optional hashed refresh token used for refresh token rotation',
    example: '$argon2id$v=19$m=65536,t=3,p=4$abc123...',
  })
  @IsOptional()
  @IsString()
  hashedRefreshToken?: string | null;
}
