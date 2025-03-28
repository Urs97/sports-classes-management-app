import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserRole } from '../users/enums/user-role.enum';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);  });

    describe('register', () => {
      it('should create a new user and return user data without password', async () => {
        const registerUserDto = { email: 'test@example.com', password: 'password' };
        const createdUser = {
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          role: UserRole.USER,
        };
    
        usersService.create.mockResolvedValue(createdUser);
    
        const result = await authService.register(registerUserDto);
    
        expect(usersService.create).toHaveBeenCalledWith(registerUserDto);
        expect(result).toEqual({
          id: createdUser.id,
          email: createdUser.email,
          role: createdUser.role,
        });
      });
    });

    describe('validateUser', () => {
      it('should return user data if validation succeeds', async () => {
        const email = 'test@example.com';
        const password = 'password';
        const user = {
          id: 1,
          email,
          password: await argon2.hash(password),
          role: UserRole.USER,
        };
    
        usersService.findByEmail.mockResolvedValue(user);
    
        const result = await authService.validateUser(email, password);
    
        expect(usersService.findByEmail).toHaveBeenCalledWith(email);
        expect(result).toEqual(user);
      });
    
      it('should throw UnauthorizedException if validation fails', async () => {
        const email = 'test@example.com';
        const password = 'wrongPassword';
        const user = {
          id: 1,
          email,
          password: await argon2.hash('password'),
          role: UserRole.USER,
        };
    
        usersService.findByEmail.mockResolvedValue(user);
    
        await expect(authService.validateUser(email, password)).rejects.toThrow(
          UnauthorizedException,
        );
      });
    });

    describe('login', () => {
      it('should return an access token', async () => {
        const user = { id: 1, email: 'test@example.com', role: UserRole.USER };
        const token = 'accessToken';
    
        jwtService.sign.mockReturnValue(token);
    
        const result = await authService.login(user);
    
        expect(jwtService.sign).toHaveBeenCalledWith({
          email: user.email,
          sub: user.id,
          role: user.role,
        });
        expect(result).toEqual({ access_token: token });
      });
    }
  );
});
