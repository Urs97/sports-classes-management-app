import { UserRole } from "src/users/enums/user-role.enum";

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
