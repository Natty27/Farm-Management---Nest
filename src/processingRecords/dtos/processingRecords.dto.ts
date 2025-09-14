// dto/create-processing.dto.ts
import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from './../../sales/dtos/sales.dto';

export class CreateProcessingDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  milkUsedLiters: number;

  @IsNotEmpty()
  @IsEnum(ProductType)
  productType: ProductType;

  @IsNotEmpty()
  @IsNumber()
  outputQuantity: number; // e.g. kg of yoghurt/cheese
}
