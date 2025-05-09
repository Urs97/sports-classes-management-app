import { Test, TestingModule } from '@nestjs/testing';

import { PaginationOptionsDto } from '../common/dto/pagination/pagination-options.dto';
import { createPaginatedResponse } from '../../test/utils/pagination.util';

import { SportController } from './sport.controller';
import { AbstractSportService } from './abstract/sport.abstract.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { SportResponse } from './response/sport.response';
import { NumberIdDto } from '../common/dto/number-id.dto';

const mockSport: SportResponse = { id: 1, name: 'Basketball' };
const idParam: NumberIdDto = { id: 1 };

describe('SportController', () => {
  let controller: SportController;
  let service: AbstractSportService;

  const sportServiceMock: Partial<Record<keyof AbstractSportService, jest.Mock>> = {
    createSport: jest.fn(),
    listSports: jest.fn(),
    updateSport: jest.fn(),
    removeSport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportController],
      providers: [
        {
          provide: AbstractSportService,
          useValue: sportServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SportController>(SportController);
    service = module.get<AbstractSportService>(AbstractSportService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated sports', async () => {
      const paginationOptions: PaginationOptionsDto = {
        page: 1, limit: 10,
        skip: 0
      };

      const paginatedResponse = createPaginatedResponse([mockSport], 1, 10, 1);

      sportServiceMock.listSports!.mockResolvedValue(paginatedResponse);
  
      const result = await controller.findAll(paginationOptions);
  
      expect(result).toEqual(paginatedResponse);
      expect(service.listSports).toHaveBeenCalledWith(paginationOptions);
    });
  });

  describe('create', () => {
    it('should create a new sport', async () => {
      const dto: CreateSportDto = { name: 'Basketball' };
      sportServiceMock.createSport!.mockResolvedValue(mockSport);
      const result = await controller.create(dto);
      expect(result).toEqual(mockSport);
      expect(service.createSport).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return the sport', async () => {
      const dto: UpdateSportDto = { name: 'Football' };
      const updatedSport = { id: 1, name: 'Football' };
      sportServiceMock.updateSport!.mockResolvedValue(updatedSport);
      const result = await controller.update(idParam, dto);
      expect(result).toEqual(updatedSport);
      expect(service.updateSport).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call remove', async () => {
      sportServiceMock.removeSport!.mockResolvedValue(undefined);
      await controller.remove(idParam);
      expect(service.removeSport).toHaveBeenCalledWith(1);
    });
  });
});
