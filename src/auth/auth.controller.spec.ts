import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { AuthenticatedUserRequest } from './interfaces/authenticated-user-request.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import { sanitizeUser } from '../users/utils/user.utils';

jest.mock('../users/utils/user.utils', () => ({
  sanitizeUser: jest.fn().mockReturnValue({
    id: 1,
    email: 'test@example.com',
    role: 'user',
  }),
}));

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    loginAndSetCookies: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register user and return user data', async () => {
      const dto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedUser = {
        id: 1,
        email: 'test@example.com',
        role: UserRole.USER,
      };

      mockAuthService.register.mockResolvedValue(expectedUser);

      const result = await authController.register(dto);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('login', () => {
    it('should call loginAndSetCookies with user and response', async () => {
      const mockRequest = {
        user: {
          id: 1,
          email: 'test@example.com',
          role: UserRole.USER,
        },
      } as AuthenticatedUserRequest;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const expectedResult = { accessToken: 'accessToken', refreshToken: 'refreshToken' };

      mockAuthService.loginAndSetCookies.mockResolvedValue(expectedResult);

      const result = await authController.login(mockRequest, mockResponse);

      expect(mockAuthService.loginAndSetCookies).toHaveBeenCalledWith(mockRequest.user, mockResponse);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refresh', () => {
    it('should call refreshTokens and set cookie', async () => {
      const mockRequest = {
        cookies: {
          refresh_token: 'some-token',
        },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const expected = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      mockAuthService.refreshTokens.mockResolvedValue(expected);

      const result = await authController.refresh(1, mockRequest, mockResponse);

      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(1, 'some-token', mockResponse);
      expect(result).toEqual(expected);
    });
  });

  describe('logout', () => {
    it('should call logout and clear refresh_token cookie', async () => {
      const mockClearCookie = jest.fn();
      const mockResponse = {
        clearCookie: mockClearCookie,
      } as unknown as Response;

      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await authController.logout(1, mockResponse);

      expect(mockAuthService.logout).toHaveBeenCalledWith(1);
      expect(mockClearCookie).toHaveBeenCalledWith('refresh_token', { path: '/auth/refresh' });
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('getMe', () => {
    it('should return sanitized user', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'secret',
        role: UserRole.USER,
      } as User;

      const result = authController.getMe(user);

      expect(sanitizeUser).toHaveBeenCalledWith(user);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        role: UserRole.USER,
      });
    });
  });

  it('should have JwtAuthGuard on getMe', () => {
    const guards = Reflect.getMetadata('__guards__', AuthController.prototype.getMe);
    const names = guards.map((g: any) => g.name);
    expect(names).toContain(JwtAuthGuard.name);
  });

  it('should have LocalAuthGuard on login', () => {
    const guards = Reflect.getMetadata('__guards__', AuthController.prototype.login);
    const names = guards.map((g: any) => g.name);
    expect(names).toContain(LocalAuthGuard.name);
  });

  it('should have RefreshTokenGuard on refresh', () => {
    const guards = Reflect.getMetadata('__guards__', AuthController.prototype.refresh);
    const names = guards.map((g: any) => g.name);
    expect(names).toContain(RefreshTokenGuard.name);
  });
});
