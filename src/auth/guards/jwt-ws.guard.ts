import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';

@Injectable()
export class JwtWsGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const client: Socket = context.switchToWs().getClient();
        const token = client.handshake.auth.token;

        if (!token) {
        throw new UnauthorizedException('Missing auth token');
        }

        try {
        const payload = this.jwtService.verify(token, {
            secret: this.configService.get('JWT_SECRET'),
        });

        (client as any).user = payload;
        return true;
        } catch {
        throw new UnauthorizedException('Invalid or expired token');
        }
    }
}