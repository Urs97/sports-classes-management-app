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
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account. Email must be unique. Returns sanitized user data (without password).',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: SanitizedUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or email already exists',
  })
  @ApiBody({
    type: RegisterUserDto,
    description: 'User registration data including email and password',
  })
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(200)
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates a user and returns an access token in the response body. A refresh token is sent as an HttpOnly cookie.',
  })
  @ApiOkResponse({
    description: 'Login successful',
    type: AuthResponseDto,
    examples: {
      success: {
        summary: 'Login success',
        value: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          tokenType: 'bearer',
          message: 'Refresh token set in HttpOnly, Secure cookie',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password is incorrect',
  })
  @ApiBody({
    type: RegisterUserDto,
    description: 'Email and password fields for login',
  })
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
      'Returns a new access token if the refresh token is valid. The refresh token must be sent in the HttpOnly cookie.',
  })
  @ApiOkResponse({
    description: 'Access token refreshed successfully',
    type: AuthResponseDto,
    examples: {
      success: {
        summary: 'Refresh success',
        value: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          tokenType: 'bearer',
          message: 'New refresh token set in HttpOnly, Secure cookie',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is missing, invalid, or expired',
  })
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
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Logs out the user by clearing the refresh token cookie and invalidating the session.',
  })
  @ApiOkResponse({
    description: 'User logged out successfully',
    schema: {
      example: { message: 'Logged out successfully' },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
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
  @ApiOperation({
    summary: 'Get current user',
    description:
      'Returns the authenticated user’s information (ID, email, role) based on the access token.',
  })
  @ApiOkResponse({
    description: 'Authenticated user details',
    type: SanitizedUserDto,
    examples: {
      user: {
        summary: 'Example user',
        value: {
          id: 1,
          email: 'user@example.com',
          role: 'USER',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  getMe(@CurrentUser() user: User): SanitizedUserDto {
    return sanitizeUser(user);
  }
}