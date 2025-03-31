import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.ADMIN,
    description: 'Optional role to assign to the user (e.g. ADMIN or USER)',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description:
      'Optional hashed refresh token used for session handling (set internally, not user-supplied)',
    example: '$argon2id$v=19$m=65536,t=3,p=4$abc123...',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  hashedRefreshToken?: string | null;
}
