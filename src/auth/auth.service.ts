import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.create(registerUserDto);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (user && await argon2.verify(user.password, pass)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: Omit<User, 'password'>) {
    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
