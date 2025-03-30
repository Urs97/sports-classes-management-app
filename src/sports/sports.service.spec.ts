import { Test, TestingModule } from '@nestjs/testing';
import { SportsService } from './sports.service';
import { Sport } from './entities/sport.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockSport = { id: 1, name: 'Basketball' };

describe('SportsService', () => {
  let service: SportsService;
  let repo: Repository<Sport>;

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
        SportsService,
        {
          provide: getRepositoryToken(Sport),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<SportsService>(SportsService);
    repo = module.get<Repository<Sport>>(getRepositoryToken(Sport));
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new sport', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(mockSport);
      mockRepo.save.mockResolvedValue(mockSport);

      const result = await service.create({ name: 'Basketball' });
      expect(result).toEqual(mockSport);
      expect(mockRepo.create).toHaveBeenCalledWith({ name: 'Basketball' });
    });

    it('should throw ConflictException if sport already exists', async () => {
      mockRepo.findOne.mockResolvedValue(mockSport);
      await expect(service.create({ name: 'Basketball' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all sports', async () => {
      mockRepo.find.mockResolvedValue([mockSport]);
      const result = await service.findAll();
      expect(result).toEqual([mockSport]);
    });
  });

  describe('findOne', () => {
    it('should return a sport by ID', async () => {
      mockRepo.findOne.mockResolvedValue(mockSport);
      const result = await service.findOne(1);
      expect(result).toEqual(mockSport);
    });

    it('should throw NotFoundException if sport not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the sport', async () => {
      const updatedSport = { id: 1, name: 'Football' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockSport as any);
      mockRepo.save.mockResolvedValue(updatedSport);

      const result = await service.update(1, { name: 'Football' });
      expect(result).toEqual(updatedSport);
    });
  });

  describe('remove', () => {
    it('should remove the sport', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockSport as any);
      mockRepo.remove.mockResolvedValue(mockSport);
      await expect(service.remove(1)).resolves.toBeUndefined();
    });
  });
});
