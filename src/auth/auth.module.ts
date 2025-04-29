import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { AuthController } from './auth.controller';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { RootConfig } from '../common/config/env.validation';
import { WsJwtAuthMiddleware } from './guards/jwt-ws.middleware';
import { TypedConfigModule } from 'nest-typed-config';

@Module({
  imports: [
    TypedConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [TypedConfigModule],
      inject: [RootConfig],
      useFactory: (config: RootConfig) => ({
        secret: config.AUTH.JWTSECRET,
        signOptions: {
          expiresIn: config.AUTH.ACCESSTOKENEXPIRESIN,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    RolesGuard,
    WsJwtAuthMiddleware,
  ],
  exports: [AuthService, JwtModule, WsJwtAuthMiddleware],
})
export class AuthModule {}
