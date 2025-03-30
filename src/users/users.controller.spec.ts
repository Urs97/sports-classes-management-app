import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-role.enum';
import { User } from './entities/user.entity';

const mockUser: User = {
  id: 1,
  email: 'user@example.com',
  password: 'hashedPassword',
  role: UserRole.USER,
  hashedRefreshToken: null,
};

const mockSanitizedUser = {
  id: 1,
  email: 'user@example.com',
  role: UserRole.USER,
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const usersServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create and return a sanitized user', async () => {
      usersServiceMock.create.mockResolvedValue(mockUser);

      const dto: CreateUserDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockSanitizedUser);
      expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return all sanitized users', async () => {
      usersServiceMock.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();
      expect(result).toEqual([mockSanitizedUser]);
      expect(usersServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a sanitized user by ID', async () => {
      usersServiceMock.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockSanitizedUser);
      expect(usersServiceMock.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update()', () => {
    it('should update and return the sanitized user', async () => {
      const updateDto: UpdateUserDto = {
        role: UserRole.ADMIN,
      };

      usersServiceMock.update.mockResolvedValue({
        ...mockUser,
        role: UserRole.ADMIN,
      });

      const result = await controller.update(1, updateDto);
      expect(result).toEqual({
        ...mockSanitizedUser,
        role: UserRole.ADMIN,
      });
      expect(usersServiceMock.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove()', () => {
    it('should call remove on the service', async () => {
      usersServiceMock.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(usersServiceMock.remove).toHaveBeenCalledWith(1);
    });
  });
});
