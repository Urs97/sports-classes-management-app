import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AuthenticatedUserRequest } from './interfaces/authenticated-user-request.interface';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { sanitizeUser } from '../users/utils/user.utils';
import { clearRefreshTokenCookie } from './utils/cookie.utils';
import { SanitizedUserDto } from '../users/dto/sanitized-user.dto';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: 'Login and receive access & refresh tokens' })
  @ApiResponse({ status: 200, description: 'Successful login with tokens' })
  @ApiBody({ type: RegisterUserDto })
  async login(
    @Request() req: AuthenticatedUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginAndSetCookies(req.user, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'New access token issued' })
  async refresh(
    @CurrentUser('sub') userId: number,
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    return this.authService.refreshTokens(userId, refreshToken, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user and clear refresh token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @CurrentUser('id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    clearRefreshTokenCookie(res);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get currently authenticated user info' })
  @ApiResponse({ status: 200, description: 'Returns user info' })
  getMe(@CurrentUser() user: User): SanitizedUserDto {
    return sanitizeUser(user);
  }
}
