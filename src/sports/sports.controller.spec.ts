import { Test, TestingModule } from '@nestjs/testing';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sport.entity';

const mockSport: Sport = { id: 1, name: 'Basketball' };

describe('SportsController', () => {
  let controller: SportsController;
  let service: SportsService;

  const sportsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportsController],
      providers: [{ provide: SportsService, useValue: sportsServiceMock }],
    }).compile();

    controller = module.get<SportsController>(SportsController);
    service = module.get<SportsService>(SportsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all sports', async () => {
      sportsServiceMock.findAll.mockResolvedValue([mockSport]);
      const result = await controller.findAll();
      expect(result).toEqual([mockSport]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new sport', async () => {
      const dto: CreateSportDto = { name: 'Basketball' };
      sportsServiceMock.create.mockResolvedValue(mockSport);
      const result = await controller.create(dto);
      expect(result).toEqual(mockSport);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return the sport', async () => {
      const dto: UpdateSportDto = { name: 'Football' };
      const updatedSport = { id: 1, name: 'Football' };
      sportsServiceMock.update.mockResolvedValue(updatedSport);
      const result = await controller.update(1, dto);
      expect(result).toEqual(updatedSport);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call remove', async () => {
      sportsServiceMock.remove.mockResolvedValue(undefined);
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
