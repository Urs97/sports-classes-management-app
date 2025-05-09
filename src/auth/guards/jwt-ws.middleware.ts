import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AbstractWsJwtAuthMiddleware } from '../abstract/jwt-ws.abstract.middleware';

@Injectable()
export class WsJwtAuthMiddleware implements AbstractWsJwtAuthMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(socket: Socket, next: (err?: Error) => void): void {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new UnauthorizedException('Authentication error: Token missing'));
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      socket.data.user = payload;
      next();
    } catch {
      return next(new UnauthorizedException('Authentication error: Invalid token'));
    }
  }
}