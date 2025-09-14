// create-sale.dto.ts
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ProductType {
  MILK = 'milk',
  BUTTER = 'butter',
  CHEESE = 'cheese',
  COW = 'cow',
  MANURE = 'manure',
  OTHERS = 'others',
  YOGHURT = 'yoghurt',
}

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsEnum(ProductType)
  @IsNotEmpty()
  product_type: ProductType;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  shift: string;

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  payment_method?: string;
}
