// process-payment.dto.ts
import { IsDate, IsOptional } from 'class-validator';

export class ProcessPaymentDto {
  @IsOptional()
  @IsDate()
  paymentDate?: Date;

  constructor() {
    this.paymentDate = this.paymentDate || new Date();
  }
}
