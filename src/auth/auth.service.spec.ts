import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../common/config/env.validation'; 
import * as argon2 from 'argon2';
import { UserRole } from '../users/enums/user-role.enum';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

jest.mock('argon2');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = (overrides = {}) => ({
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    hashedRefreshToken: 'storedHashedToken',
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: AuthConfig,
          useValue: {
            accessTokenExpiresIn: '15m',
            refreshTokenExpiresIn: '7d',
            refreshTokenSecret: 'test_refresh_secret',
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should create user and return without password or hashedRefreshToken', async () => {
      const dto = { email: 'test@example.com', password: 'pass' };
      const user = mockUser();
      usersService.create.mockResolvedValue(user);

      const result = await authService.register(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    });
  });

  describe('validateUser', () => {
    it('should validate and return user', async () => {
      const user = mockUser();
      usersService.findByEmail.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(user.email, 'pass');

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException on failure', async () => {
      const user = mockUser();
      usersService.findByEmail.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(authService.validateUser(user.email, 'bad')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should sign tokens and update refresh token', async () => {
      const user = mockUser();
      jwtService.sign
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      (argon2.hash as jest.Mock).mockResolvedValue('mockHashedRefreshToken');
      usersService.update.mockResolvedValue(user);

      const result = await authService.login({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      expect(usersService.update).toHaveBeenCalledWith(user.id, {
        hashedRefreshToken: 'mockHashedRefreshToken',
      });
    });
  });

  describe('refreshTokens', () => {
    it('should verify and return new tokens', async () => {
      const refreshToken = 'validRefreshToken';
      const user = mockUser({ hashedRefreshToken: 'fakeHashedToken' });

      usersService.findOne.mockResolvedValue(user);
      jwtService.sign
        .mockReturnValueOnce('newAccessToken')
        .mockReturnValueOnce('newRefreshToken');

      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('mockHashedRefreshToken');

      const res = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await authService.refreshTokens(user.id, refreshToken, res);

      expect(result).toEqual({
        access_token: 'newAccessToken',
      });

      expect(usersService.update).toHaveBeenCalledWith(user.id, {
        hashedRefreshToken: 'mockHashedRefreshToken',
      });

      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'newRefreshToken',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/auth/refresh',
        }),
      );
    });
  });

  describe('logout', () => {
    it('should clear the hashed refresh token', async () => {
      usersService.update.mockResolvedValue(mockUser());

      await authService.logout(1);

      expect(usersService.update).toHaveBeenCalledWith(1, { hashedRefreshToken: null });
    });
  });
});
