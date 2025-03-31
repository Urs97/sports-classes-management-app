import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtUserPayload } from '../interfaces/jwt-user-payload.interface';
import { SanitizedUserDto } from '../../users/dto/sanitized-user.dto';

export const buildJwtPayload = (user: JwtUserPayload): JwtPayload => ({
  sub: user.id,
  email: user.email,
  role: user.role,
});

export const mapToJwtUserPayload = (user: SanitizedUserDto): JwtUserPayload => ({
  id: user.id,
  email: user.email,
  role: user.role,
});
