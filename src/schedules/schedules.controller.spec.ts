import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

const mockSchedule = {
  id: 1,
  date: new Date('2024-04-01T10:00:00Z'),
  duration: 60,
  class: { id: 1, description: 'Football Basics' },
};

describe('SchedulesController', () => {
  let controller: SchedulesController;
  let service: SchedulesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [{ provide: SchedulesService, useValue: mockService }],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
    service = module.get<SchedulesService>(SchedulesService);
    jest.clearAllMocks();
  });

  it('should create a schedule', async () => {
    mockService.create.mockResolvedValue(mockSchedule);
    const dto: CreateScheduleDto = {
      classId: 1,
      date: mockSchedule.date,
      duration: 60,
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockSchedule);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all schedules', async () => {
    mockService.findAll.mockResolvedValue([mockSchedule]);
    const result = await controller.findAll();
    expect(result).toEqual([mockSchedule]);
  });

  it('should return a schedule by ID', async () => {
    mockService.findOne.mockResolvedValue(mockSchedule);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockSchedule);
  });

  it('should update a schedule', async () => {
    const updated = { ...mockSchedule, duration: 90 };
    mockService.update.mockResolvedValue(updated);
    const dto: UpdateScheduleDto = { duration: 90 };
    const result = await controller.update(1, dto);
    expect(result).toEqual(updated);
  });

  it('should remove a schedule', async () => {
    mockService.remove.mockResolvedValue(undefined);
    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
