import { Request } from 'express';
import { UserRole } from '../../users/enums/user-role.enum';

export interface AuthenticatedUserRequest extends Request {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}
