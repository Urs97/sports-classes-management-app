import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateClassDto {
  @IsNumber()
  sportId: number;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  duration: number;
}
