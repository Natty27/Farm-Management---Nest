import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateCowDto {
  @IsString()
  name: string;

  @Type(() => Date)
  birthDate: Date;

  @IsString()
  breed: string;
}
