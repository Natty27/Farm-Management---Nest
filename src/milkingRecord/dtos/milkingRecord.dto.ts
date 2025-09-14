import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
} from 'class-validator';
import { MilkingTime, MilkSourceType } from './../schemas/milkingRecord.schema';
export class CreateMilkingRecordDto {
  @IsEnum(MilkSourceType)
  source_type: MilkSourceType;

  @IsOptional()
  @IsMongoId()
  cow_id?: string;

  @IsOptional()
  @IsMongoId()
  provider_id?: string;

  @IsDateString()
  date: Date;

  @IsEnum(MilkingTime)
  time: MilkingTime;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  cost_price?: number;

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
  @IsMongoId()
  added_by?: string;
}
