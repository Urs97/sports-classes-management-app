import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUser = { id: 1, email: 'test@example.com', role: 'USER' };
const mockClass = { id: 1, description: 'Football Basics', duration: 60 };
const mockEnrollment = {
  id: 1,
  user: mockUser,
  class: mockClass,
  enrolledAt: new Date(),
};

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let enrollmentRepo: Repository<Enrollment>;
  let userRepo: Repository<User>;
  let classRepo: Repository<Class>;

  const mockEnrollmentRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const mockClassRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: getRepositoryToken(Enrollment), useValue: mockEnrollmentRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Class), useValue: mockClassRepo },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    enrollmentRepo = module.get(getRepositoryToken(Enrollment));
    userRepo = module.get(getRepositoryToken(User));
    classRepo = module.get(getRepositoryToken(Class));
    jest.clearAllMocks();
  });

  it('should create enrollment if user and class exist and not already enrolled', async () => {
    mockUserRepo.findOne.mockResolvedValue(mockUser);
    mockClassRepo.findOne.mockResolvedValue(mockClass);
    mockEnrollmentRepo.findOne.mockResolvedValue(null);
    mockEnrollmentRepo.create.mockReturnValue(mockEnrollment);
    mockEnrollmentRepo.save.mockResolvedValue(mockEnrollment);

    const result = await service.create(1, { classId: 1 });

    expect(result).toEqual(mockEnrollment);
    expect(mockEnrollmentRepo.save).toHaveBeenCalled();
  });

  it('should throw if user is not found', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    await expect(service.create(1, { classId: 1 })).rejects.toThrow(NotFoundException);
  });

  it('should throw if class is not found', async () => {
    mockUserRepo.findOne.mockResolvedValue(mockUser);
    mockClassRepo.findOne.mockResolvedValue(null);
    await expect(service.create(1, { classId: 1 })).rejects.toThrow(NotFoundException);
  });

  it('should throw if already enrolled', async () => {
    mockUserRepo.findOne.mockResolvedValue(mockUser);
    mockClassRepo.findOne.mockResolvedValue(mockClass);
    mockEnrollmentRepo.findOne.mockResolvedValue(mockEnrollment);
    await expect(service.create(1, { classId: 1 })).rejects.toThrow(ConflictException);
  });

  it('should return all enrollments', async () => {
    mockEnrollmentRepo.find.mockResolvedValue([mockEnrollment]);
    const result = await service.findAll();
    expect(result).toEqual([mockEnrollment]);
  });

  it('should return enrollments by class ID', async () => {
    mockEnrollmentRepo.find.mockResolvedValue([mockEnrollment]);
    const result = await service.findByClass(1);
    expect(result).toEqual([mockEnrollment]);
  });

  it('should return enrollments by user ID', async () => {
    mockEnrollmentRepo.find.mockResolvedValue([mockEnrollment]);
    const result = await service.findByUser(1);
    expect(result).toEqual([mockEnrollment]);
  });
});
