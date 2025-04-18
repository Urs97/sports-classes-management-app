import { Module } from '@nestjs/common';
import { SportController } from './sport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from './schema/sport.schema';
import { SportService } from './services/sport-service';
import { SportRepository } from './services/sport-repository';
import { CreateSportTransaction } from './services/create-sport-transaction';
import { AbstractSportRepository } from './abstract/sport.abstract.repository';
import { AbstractSportService } from './abstract/sport.abstract.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  controllers: [SportController],
  providers: [
    SportService,
    SportRepository,
    CreateSportTransaction,

    {
      provide: AbstractSportRepository,
      useClass: SportRepository,
    },
    {
      provide: AbstractSportService,
      useClass: SportService,
    },
  ],
  exports: [AbstractSportRepository, AbstractSportService],
})
export class SportModule {}

