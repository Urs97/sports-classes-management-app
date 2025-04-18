import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { SportModule } from '../sport/sport.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    SportModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService]
})
export class ClassesModule {}
