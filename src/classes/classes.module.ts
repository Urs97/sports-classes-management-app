import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Sport } from 'src/sports/entities/sport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Sport])],
  controllers: [ClassesController],
  providers: [ClassesService]
})
export class ClassesModule {}
