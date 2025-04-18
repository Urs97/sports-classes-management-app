import { Test, TestingModule } from '@nestjs/testing';
import { SportService } from './sport-service';
import { AbstractSportRepository } from '../abstract/sport.abstract.repository';
import { CreateSportTransaction } from './create-sport-transaction';
import { ISportRecord } from '../interface/sport.interface';
import { NotFoundException } from '@nestjs/common';

const mockSport: ISportRecord = { id: 1, name: 'Basketball' };
const mockUpdatedSport: ISportRecord = { id: 1, name: 'Football' };

describe('SportService', () => {
  let service: SportService;
  let repo: AbstractSportRepository;
  let transaction: CreateSportTransaction;

  const repoMock = {
    getSportById: jest.fn(),
    getAllSports: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const transactionMock = {
    run: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportService,
        {
          provide: AbstractSportRepository,
          useValue: repoMock,
        },
        {
          provide: CreateSportTransaction,
          useValue: transactionMock,
        },
      ],
    }).compile();

    service = module.get<SportService>(SportService);
    repo = module.get<AbstractSportRepository>(AbstractSportRepository);
    transaction = module.get<CreateSportTransaction>(CreateSportTransaction);

    jest.clearAllMocks();
  });

  describe('createSport', () => {
    it('should create and return a sport', async () => {
      transactionMock.run.mockResolvedValue(mockSport);
      const result = await service.createSport({ name: 'Basketball' });
      expect(result).toEqual(mockSport);
      expect(transactionMock.run).toHaveBeenCalledWith({ name: 'Basketball' });
    });
  });

  describe('listSports', () => {
    it('should return all sports', async () => {
      repoMock.getAllSports.mockResolvedValue([mockSport]);
      const result = await service.listSports();
      expect(result).toEqual([mockSport]);
    });
  });

  describe('updateSport', () => {
    it('should update and return the sport', async () => {
      repoMock.getSportById
        .mockResolvedValueOnce(mockSport)
        .mockResolvedValueOnce(mockUpdatedSport);

      repoMock.save.mockResolvedValue(undefined);

      const result = await service.updateSport(1, { name: 'Football' });

      expect(repoMock.getSportById).toHaveBeenCalledTimes(2);
      expect(repoMock.save).toHaveBeenCalledWith({
        ...mockSport,
        name: 'Football',
      });
      expect(result).toEqual(mockUpdatedSport);
    });

    it('should throw NotFoundException if sport does not exist', async () => {
      repoMock.getSportById.mockResolvedValue(null);
      await expect(service.updateSport(999, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeSport', () => {
    it('should remove a sport by ID', async () => {
      repoMock.getSportById.mockResolvedValue(mockSport);
      repoMock.delete.mockResolvedValue(undefined);

      await expect(service.removeSport(1)).resolves.toBeUndefined();
      expect(repoMock.getSportById).toHaveBeenCalledWith(1);
      expect(repoMock.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if sport does not exist', async () => {
      repoMock.getSportById.mockResolvedValue(null);
      await expect(service.removeSport(999)).rejects.toThrow(NotFoundException);
    });
  });
});
