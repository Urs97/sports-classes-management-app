/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'reflect-metadata';
import { TestBed } from '@automock/jest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SportService } from './sport-service';
import { AbstractSportRepository } from '../abstract/sport.abstract.repository';
import { ISportRecord } from '../interface/sport.interface';
import { PaginationOptionsDto } from '../../common/dto/pagination/pagination-options.dto';
import { createPaginatedResponse } from '../../../test/utils/pagination.util';

const mockSport: ISportRecord = { id: 1, name: 'Basketball' };
const mockUpdatedSport: ISportRecord = { id: 1, name: 'Football' };

describe('SportService', () => {
  let service: SportService;
  let repo: jest.Mocked<AbstractSportRepository>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(SportService).compile();
    service = unit;
    // @ts-ignore
    repo = unitRef.get(AbstractSportRepository);
  });

  describe('createSport', () => {
    it('should create and return a sport', async () => {
      repo.getSportByName.mockResolvedValue(null);
      repo.create.mockResolvedValue(mockSport);

      const result = await service.createSport({ name: 'Basketball' });

      expect(result).toEqual(mockSport);
      expect(repo.getSportByName).toHaveBeenCalledWith('Basketball');
      expect(repo.create).toHaveBeenCalledWith({ name: 'Basketball' });
    });

    it('should throw ConflictException if sport exists', async () => {
      repo.getSportByName.mockResolvedValue(mockSport);

      await expect(service.createSport({ name: 'Basketball' })).rejects.toThrow(ConflictException);
      expect(repo.getSportByName).toHaveBeenCalledWith('Basketball');
    });
  });

  describe('listSports', () => {
    it('should return paginated sports list', async () => {
      const paginationOptions: PaginationOptionsDto = { page: 1, limit: 10, skip: 0 };
      const mockData = createPaginatedResponse([mockSport], 1, 10, 1);
      repo.getSportsAndCount.mockResolvedValue([[mockSport], 1]);

      const result = await service.listSports(paginationOptions);

      expect(result).toEqual(mockData);
      expect(repo.getSportsAndCount).toHaveBeenCalledWith(paginationOptions);
    });
  });

  describe('updateSport', () => {
    it('should update and return the sport', async () => {
      repo.getSportById
        .mockResolvedValueOnce(mockSport)
        .mockResolvedValueOnce(mockUpdatedSport);
      repo.save.mockResolvedValue({ id: 1, name: 'Test' });

      const result = await service.updateSport(1, { name: 'Football' });

      expect(result).toEqual(mockUpdatedSport);
      expect(repo.getSportById).toHaveBeenCalledTimes(2);
      expect(repo.save).toHaveBeenCalledWith({ ...mockSport, name: 'Football' });
    });

    it('should throw NotFoundException if sport does not exist', async () => {
      repo.getSportById.mockResolvedValue(null);

      await expect(service.updateSport(999, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeSport', () => {
    it('should remove a sport by ID', async () => {
      repo.getSportById.mockResolvedValue(mockSport);
      repo.delete.mockResolvedValue({ affected: 1, raw: {} });

      await expect(service.removeSport(1)).resolves.toBeUndefined();
      expect(repo.getSportById).toHaveBeenCalledWith(1);
      expect(repo.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if sport does not exist', async () => {
      repo.getSportById.mockResolvedValue(null);

      await expect(service.removeSport(999)).rejects.toThrow(NotFoundException);
    });
  });
});