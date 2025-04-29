import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUserRequest } from '../interfaces/authenticated-user-request.interface';
import { AuthConfig } from '../../common/config/env.validation';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: AuthConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: AuthenticatedUserRequest) => req?.cookies?.['refresh_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: config.REFRESHTOKENSECRET,
    });
  }

  async validate(payload: any) {
    if (!payload?.sub) throw new UnauthorizedException('Invalid refresh token');
    return payload;
  }
}