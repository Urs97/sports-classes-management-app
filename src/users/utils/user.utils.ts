import { User } from '../entities/user.entity';
import { SanitizedUser } from '../interfaces/sanitized-user.interface';

export const sanitizeUser = (user: User): SanitizedUser => {
  const { password, hashedRefreshToken, ...sanitizedUser } = user;
  return sanitizedUser;
};
