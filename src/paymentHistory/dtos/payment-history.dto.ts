import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatus } from '../schemas/payment-history.schema';

export class CreatePaymentHistoryDto {
  @IsMongoId()
  customerId: string;

  @IsNumber()
  amount: number;

  @IsDate()
  paymentDate: Date;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsOptional() // Make it optional since it's generated
  @IsString()
  referenceNumber?: string; // Now optional

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class PaymentHistoryResponseDto {
  id: string;
  customerId: string;
  amount: number;
  paymentDate: Date;
  status: PaymentStatus;
  referenceNumber?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}
