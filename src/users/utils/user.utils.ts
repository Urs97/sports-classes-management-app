import { User } from '../entities/user.entity';
import { SanitizedUserDto } from '../dto/sanitized-user.dto';

export const sanitizeUser = (user: User): SanitizedUserDto => {
  const { password, hashedRefreshToken, ...sanitizedUser } = user;
  return sanitizedUser;
};
