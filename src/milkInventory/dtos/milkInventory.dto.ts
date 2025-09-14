// dto/create-milk-inventory.dto.ts
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMilkInventoryDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsNumber()
  openingBalanceLiters?: number = 0;

  @IsOptional()
  @IsNumber()
  collectedLiters?: number = 0;

  @IsOptional()
  @IsNumber()
  soldLiters?: number = 0;

  @IsOptional()
  @IsNumber()
  processedLiters?: number = 0;

  @IsOptional()
  @IsNumber()
  closingBalanceLiters?: number = 0;
}
