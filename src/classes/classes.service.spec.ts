import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AbstractSportRepository } from '../sport/abstract/sport.abstract.repository';

const mockClass = {
  id: 1,
  description: 'Football Basics',
  duration: 60,
  sport: { id: 1, name: 'Football' },
  schedules: [],
};

describe('ClassesService', () => {
  let service: ClassesService;
  let classRepo: Repository<Class>;
  let sportRepo: AbstractSportRepository;

  const mockClassRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockSportRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        { provide: getRepositoryToken(Class), useValue: mockClassRepo },
        { provide: AbstractSportRepository, useValue: mockSportRepo },
      ],
    }).compile();
  
    service = module.get<ClassesService>(ClassesService);
    classRepo = module.get(getRepositoryToken(Class));
    sportRepo = module.get(AbstractSportRepository);
  });  

  it('should create a class with a valid sport', async () => {
    mockSportRepo.findOne.mockResolvedValue(mockClass.sport);
    mockClassRepo.create.mockReturnValue(mockClass);
    mockClassRepo.save.mockResolvedValue(mockClass);

    const result = await service.create({
      description: 'Football Basics',
      duration: 60,
      sportId: 1,
    });

    expect(result).toEqual(mockClass);
    expect(mockSportRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw if sport is not found when creating', async () => {
    mockSportRepo.findOne.mockResolvedValue(null);
    await expect(
      service.create({ description: 'x', duration: 30, sportId: 999 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find all classes', async () => {
    mockClassRepo.find.mockResolvedValue([mockClass]);
    const result = await service.findAll();
    expect(result).toEqual([mockClass]);
  });

  it('should find one class by id', async () => {
    mockClassRepo.findOne.mockResolvedValue(mockClass);
    const result = await service.findOne(1);
    expect(result).toEqual(mockClass);
  });

  it('should throw if class not found', async () => {
    mockClassRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('should update class with new sport', async () => {
    const updatedClass = { ...mockClass, duration: 90 };
    jest.spyOn(service, 'findOne').mockResolvedValue(mockClass);
    mockSportRepo.findOne.mockResolvedValue(mockClass.sport);
    mockClassRepo.save.mockResolvedValue(updatedClass);

    const result = await service.update(1, { duration: 90, sportId: 1 });
    expect(result.duration).toEqual(90);
  });

  it('should remove a class', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockClass);
    mockClassRepo.remove.mockResolvedValue(mockClass);
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});
