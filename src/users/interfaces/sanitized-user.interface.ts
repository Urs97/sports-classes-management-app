import { User } from "../entities/user.entity";

export type SanitizedUser = Omit<User, 'password' | 'hashedRefreshToken'>;