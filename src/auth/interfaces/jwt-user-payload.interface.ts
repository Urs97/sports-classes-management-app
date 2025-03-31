import { UserRole } from '../../users/enums/user-role.enum';

export interface JwtUserPayload {
  id: number;
  email: string;
  role: UserRole;
}
