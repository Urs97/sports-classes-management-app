import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthenticatedUserRequest } from './interfaces/authenticated-user-request.interface';
import { UserRole } from '../users/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
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
    it('should create a new user and return user data without password', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
  
      const expectedResult = {
        id: 1,
        email: 'test@example.com',
        role: UserRole.USER,
      };
  
      mockAuthService.register.mockResolvedValue(expectedResult);
  
      const result = await authController.register(registerUserDto);
  
      expect(authService.register).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockRequest = {
        user: {
          id: 1,
          email: 'test@example.com',
          role: UserRole.USER,
        },
      } as AuthenticatedUserRequest;
  
      const expectedResult = {
        access_token: 'jwt-token',
      };
  
      mockAuthService.login.mockResolvedValue(expectedResult);
  
      const result = await authController.login(mockRequest);
  
      expect(authService.login).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toEqual(expectedResult);
    });

    it('should have LocalAuthGuard applied to login route', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        AuthController.prototype.login,
      );
  
      const guardNames = guards.map((g: any) => g.name);
      expect(guardNames).toContain(LocalAuthGuard.name);
    });
  });

  describe('getMe', () => {
    it('should return user data without password', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        role: UserRole.USER,
        password: 'secret',
      };

      const result = authController.getMe(user as User);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        role: UserRole.USER,
      });
    });
  });

  it('should have JwtAuthGuard applied to getMe route', () => {
    const guards = Reflect.getMetadata(
      '__guards__',
      AuthController.prototype.getMe,
    );
  
    const guardNames = guards.map((g: any) => g.name);
    expect(guardNames).toContain(JwtAuthGuard.name);
  });
  
});
