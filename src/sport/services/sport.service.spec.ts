import { Test, TestingModule } from '@nestjs/testing';
import { SportService } from './sport-service';
import { AbstractSportRepository } from '../abstract/sport.abstract.repository';
import { CreateSportTransaction } from './create-sport-transaction';
import { ISportRecord } from '../interface/sport.interface';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PaginationOptionsDto } from '../../common/dto/pagination/pagination-options.dto';
import { createPaginatedResponse } from '../../../test/utils/pagination.util';

const mockSport: ISportRecord = { id: 1, name: 'Basketball' };
const mockUpdatedSport: ISportRecord = { id: 1, name: 'Football' };

describe('SportService', () => {
  let service: SportService;
  let repo: AbstractSportRepository;
  let transaction: CreateSportTransaction;

  const repoMock = {
    getSportById: jest.fn(),
    getAllSports: jest.fn(),
    getSportsAndCount: jest.fn(),
    getSportByName: jest.fn(),
    create: jest.fn(),
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
      repoMock.getSportByName.mockResolvedValue(null);
      repoMock.create.mockResolvedValue(mockSport);
  
      const result = await service.createSport({ name: 'Basketball' });
  
      expect(result).toEqual(mockSport);
      expect(repoMock.getSportByName).toHaveBeenCalledWith('Basketball');
      expect(repoMock.create).toHaveBeenCalledWith({ name: 'Basketball' });
    });
  
    it('should throw ConflictException if sport already exists', async () => {
      repoMock.getSportByName.mockResolvedValue(mockSport);
  
      await expect(service.createSport({ name: 'Basketball' })).rejects.toThrow(
        ConflictException,
      );
  
      expect(repoMock.getSportByName).toHaveBeenCalledWith('Basketball');
    });
  });

  describe('listSports', () => {
    it('should return paginated sports list', async () => {
      const paginationOptions: PaginationOptionsDto = {
        page: 1, limit: 10,
        skip: 0
      };

      const mockData = createPaginatedResponse([mockSport], 1, 10, 1);

      repoMock.getSportsAndCount.mockResolvedValue([[mockSport], 1]);

      const result = await service.listSports(paginationOptions);

      expect(result).toEqual(mockData);
      expect(repoMock.getSportsAndCount).toHaveBeenCalledWith(paginationOptions);
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
