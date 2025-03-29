import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtUserPayload } from '../interfaces/jwt-user-payload.interface';
import { SanitizedUser } from 'src/users/interfaces/sanitized-user.interface';

export const buildJwtPayload = (user: JwtUserPayload): JwtPayload => ({
  sub: user.id,
  email: user.email,
  role: user.role,
});

export const mapToJwtUserPayload = (user: SanitizedUser): JwtUserPayload => ({
  id: user.id,
  email: user.email,
  role: user.role,
});
