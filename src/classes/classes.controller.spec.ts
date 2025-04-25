import { Test, TestingModule } from '@nestjs/testing';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';

const mockAdmin: User = {
  id: 1,
  email: 'admin@test.com',
  password: '',
  role: UserRole.ADMIN,
  hashedRefreshToken: null
};

const mockClass = {
  id: 1,
  description: 'Football Class',
  duration: 60,
  sport: { id: 1, name: 'Football' },
  createdBy: mockAdmin,
};

describe('ClassesController', () => {
  let controller: ClassesController;
  let service: ClassesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesController],
      providers: [{ provide: ClassesService, useValue: mockService }],
    }).compile();

    controller = module.get<ClassesController>(ClassesController);
    service = module.get<ClassesService>(ClassesService);
    jest.clearAllMocks();
  });

  it('should return all classes', async () => {
    mockService.findAll.mockResolvedValue([mockClass]);
    const result = await controller.findAll();
    expect(result).toEqual([mockClass]);
  });

  it('should return a class by ID', async () => {
    mockService.findOne.mockResolvedValue(mockClass);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockClass);
  });

  it('should create a class with authenticated admin', async () => {
    mockService.create.mockResolvedValue(mockClass);
    const dto: CreateClassDto = { description: 'Football', duration: 60, sportId: 1 };
    const result = await controller.create(dto, { userId: mockAdmin.id});
    expect(result).toEqual(mockClass);
    expect(mockService.create).toHaveBeenCalledWith(dto, { id: mockAdmin.id });
  });

  it('should update a class', async () => {
    const updated = { ...mockClass, description: 'Updated' };
    mockService.update.mockResolvedValue(updated);
    const dto: UpdateClassDto = { description: 'Updated' };
    const result = await controller.update(1, dto);
    expect(result).toEqual(updated);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a class', async () => {
    mockService.remove.mockResolvedValue(undefined);
    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
