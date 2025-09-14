// create-customer.dto.ts
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsDate,
} from 'class-validator';
import { CustomerType, CustomerStatus } from '../schemas/customer.schema';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;

  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @IsOptional()
  @IsNumber()
  monthlyPayment?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  monthlyDueDay?: number;

  @IsOptional()
  @IsNumber()
  contractDuration?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // Add this transformer
  lastPaymentDate?: Date;
}
