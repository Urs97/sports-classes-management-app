import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserRole } from './enums/user-role.enum';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  role: 'USER',
  hashedRefreshToken: null,
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockRepo.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser as any);
      await expect(
        service.create({ email: 'test@example.com', password: '123456' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash password, create and save user', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashedPW');
      mockRepo.create.mockReturnValue({ email: 'test@example.com', password: 'hashedPW' });
      mockRepo.save.mockResolvedValue({ ...mockUser, password: 'hashedPW' });

      const result = await service.create({ email: 'test@example.com', password: '123456' });
      expect(argon2.hash).toHaveBeenCalled();
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.password).toBe('hashedPW');
    });
  });

  describe('update', () => {
    it('should hash password and update user', async () => {
      const updatedUser = { ...mockUser, password: 'newHash' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(argon2, 'hash').mockResolvedValue('newHash');
      mockRepo.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, { password: 'newPW' });
      expect(result.password).toBe('newHash');
    });

    it('should update user without hashing if no password', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as any);
      mockRepo.save.mockResolvedValue({ ...mockUser, role: 'ADMIN' });

      const result = await service.update(1, { role: UserRole.ADMIN });
      expect(result.role).toBe('ADMIN');
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as any);
      mockRepo.remove.mockResolvedValue(mockUser);
      await expect(service.remove(1)).resolves.toBeUndefined();
    });
  });
});
