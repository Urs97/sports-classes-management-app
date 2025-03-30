import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

const mockEnrollment = {
  id: 1,
  enrolledAt: new Date(),
  user: { id: 1, email: 'test@example.com' },
  class: { id: 1, description: 'Football' },
};

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  let service: EnrollmentsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByClass: jest.fn(),
    findByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [{ provide: EnrollmentsService, useValue: mockService }],
    }).compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
    service = module.get<EnrollmentsService>(EnrollmentsService);
    jest.clearAllMocks();
  });

  it('should enroll a user in a class', async () => {
    mockService.create.mockResolvedValue(mockEnrollment);
    const dto: CreateEnrollmentDto = { classId: 1 };
    const result = await controller.enroll(1, dto);
    expect(result).toEqual(mockEnrollment);
    expect(service.create).toHaveBeenCalledWith(1, dto);
  });

  it('should return all enrollments', async () => {
    mockService.findAll.mockResolvedValue([mockEnrollment]);
    const result = await controller.findAll();
    expect(result).toEqual([mockEnrollment]);
  });

  it('should return enrollments by class', async () => {
    mockService.findByClass.mockResolvedValue([mockEnrollment]);
    const result = await controller.findByClass(1);
    expect(result).toEqual([mockEnrollment]);
  });

  it('should return enrollments by user', async () => {
    mockService.findByUser.mockResolvedValue([mockEnrollment]);
    const result = await controller.findByUser(1);
    expect(result).toEqual([mockEnrollment]);
  });
});
