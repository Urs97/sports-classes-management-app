import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../users/entities/user.entity';
import { AppConfigService } from '../config/config.service';
import { sanitizeUser } from '../users/utils/user.utils';
import { SanitizedUser } from '../users/interfaces/sanitized-user.interface';
import {
  buildJwtPayload,
  mapToJwtUserPayload,
} from './utils/jwt.utils';
import { JwtUserPayload } from './interfaces/jwt-user-payload.interface';
import { setRefreshTokenCookie } from './utils/cookie.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: AppConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<SanitizedUser> {
    const user = await this.usersService.create(registerUserDto);
    return sanitizeUser(user);
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && await argon2.verify(user.password, pass)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async getTokens(user: JwtUserPayload) {
    const payload = buildJwtPayload(user);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.refreshTokenExpiresIn,
      secret: this.configService.refreshTokenSecret,
    });

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.update(userId, { hashedRefreshToken });
  }

  async login(user: SanitizedUser) {
    const jwtUser = mapToJwtUserPayload(user);
    const tokens = await this.getTokens(jwtUser);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async loginAndSetCookies(user: SanitizedUser, res: Response) {
    const { accessToken, refreshToken } = await this.login(user);
    setRefreshTokenCookie(res, refreshToken);
    return { access_token: accessToken };
  }

  async refreshTokens(userId: number, refreshToken: string, res: Response) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const isMatch = await argon2.verify(user.hashedRefreshToken, refreshToken);
    if (!isMatch) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const sanitized = sanitizeUser(user);
    const jwtUser = mapToJwtUserPayload(sanitized);

    const tokens = await this.getTokens(jwtUser);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return { access_token: tokens.accessToken };
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.update(userId, { hashedRefreshToken: null });
  }
}
