import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { MilkingTime } from './../schemas/milkingRecord.schema'; // Import the MilkingTime enum

export class CreateMilkingRecordDto {
  @IsNotEmpty()
  @IsString()
  cow_id: string; // Will be converted to ObjectId

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsNotEmpty()
  @IsEnum(MilkingTime)
  time: MilkingTime;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  fat_percentage?: number;

  @IsOptional()
  @IsNumber()
  snf?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsString()
  added_by?: string; // Will be converted to ObjectId
}
