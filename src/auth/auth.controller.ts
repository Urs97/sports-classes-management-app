import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
  Req,
  UnauthorizedException,
  HttpCode,
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
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: SanitizedUserDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed or email already in use' })
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(200)
  @Post('login')
  @ApiOperation({
    summary: 'Login and receive access & refresh tokens',
    description:
      'Returns an access token in the response body and sets a refresh token in an HttpOnly cookie (Set-Cookie header).',
  })
  @ApiOkResponse({
    description: 'Successful login with access token',
    type: AuthResponseDto,
    examples: {
      success: {
        summary: 'Login success example',
        value: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          tokenType: 'bearer',
          message: 'Refresh token set in HttpOnly, Secure cookie (Set-Cookie header)',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: RegisterUserDto })
  async login(
    @Request() req: AuthenticatedUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginAndSetCookies(req.user, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(200)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Returns a new access token in the response body and sets a new refresh token in an HttpOnly cookie.',
  })
  @ApiOkResponse({
    description: 'Access token refreshed',
    type: AuthResponseDto,
    examples: {
      success: {
        summary: 'Token refresh success example',
        value: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          tokenType: 'bearer',
          message: 'Refresh token set in HttpOnly, Secure cookie (Set-Cookie header)',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid refresh token' })
  async refresh(
    @CurrentUser('sub') userId: number,
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
    return this.authService.refreshTokens(userId, refreshToken, res);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user and clear refresh token' })
  @ApiOkResponse({ description: 'Logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
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
  @ApiOkResponse({
    description: 'Returns authenticated user info',
    type: SanitizedUserDto,
    examples: {
      example: {
        summary: 'Current user',
        value: {
          id: 1,
          email: 'user@example.com',
          role: 'USER',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  getMe(@CurrentUser() user: User): SanitizedUserDto {
    return sanitizeUser(user);
  }
}
