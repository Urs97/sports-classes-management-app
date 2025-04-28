import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Class } from '../classes/entities/class.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

const mockClass = {
  id: 1,
  description: 'Football Basics',
  duration: 60,
  sport: { id: 1, name: 'Football' },
  schedules: [],
  createdById: 1,
  createdBy: { id: 1 } as User,
};

const mockSchedule = {
  id: 1,
  date: new Date('2024-04-01T10:00:00Z'),
  duration: 60,
  class: mockClass,
};

describe('SchedulesService', () => {
  let service: SchedulesService;
  let scheduleRepo: Repository<Schedule>;
  let classRepo: Repository<Class>;

  const mockScheduleRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockClassRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        { provide: getRepositoryToken(Schedule), useValue: mockScheduleRepo },
        { provide: getRepositoryToken(Class), useValue: mockClassRepo },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
    scheduleRepo = module.get(getRepositoryToken(Schedule));
    classRepo = module.get(getRepositoryToken(Class));
    jest.clearAllMocks();
  });

  it('should create a schedule if class exists', async () => {
    mockClassRepo.findOne.mockResolvedValue(mockClass);
    mockScheduleRepo.create.mockReturnValue(mockSchedule);
    mockScheduleRepo.save.mockResolvedValue(mockSchedule);

    const dto = {
      date: mockSchedule.date,
      duration: 60,
      classId: 1,
    };

    const result = await service.create(dto);
    expect(result).toEqual(mockSchedule);
    expect(classRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw if class does not exist', async () => {
    mockClassRepo.findOne.mockResolvedValue(null);
    await expect(
      service.create({ classId: 999, date: new Date(), duration: 60 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return all schedules', async () => {
    mockScheduleRepo.find.mockResolvedValue([mockSchedule]);
    const result = await service.findAll();
    expect(result).toEqual([mockSchedule]);
  });

  it('should return a schedule by ID', async () => {
    mockScheduleRepo.findOne.mockResolvedValue(mockSchedule);
    const result = await service.findOne(1);
    expect(result).toEqual(mockSchedule);
  });

  it('should throw if schedule not found', async () => {
    mockScheduleRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update schedule with class', async () => {
    const updatedSchedule = { ...mockSchedule, duration: 90 };
    jest.spyOn(service, 'findOne').mockResolvedValue(mockSchedule);
    mockClassRepo.findOne.mockResolvedValue(mockClass);
    mockScheduleRepo.save.mockResolvedValue(updatedSchedule);

    const result = await service.update(1, { classId: 1, duration: 90 });
    expect(result.duration).toBe(90);
  });

  it('should remove schedule', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockSchedule);
    mockScheduleRepo.remove.mockResolvedValue(mockSchedule);
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});
