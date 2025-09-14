import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentHistoryService } from './payment-history.service';
import { CreatePaymentHistoryDto } from './dtos/payment-history.dto';
import { CreateCustomerDto } from 'src/customer/dtos/customer.dto';

@Controller('payment-history')
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {}

  @Post()
  async create(@Body() createDto: CreatePaymentHistoryDto) {
    return this.paymentHistoryService.createPaymentHistory(createDto);
  }

  @Get('customer/:customerId')
  async getCustomerHistory(@Param('customerId') customerId: string) {
    return this.paymentHistoryService.getCustomerPaymentHistory(customerId);
  }

  @Get()
  async getPaymentHistorys() {
    return this.paymentHistoryService.getPaymentHistorys();
  }

  @Get('customer/:customerId/report')
  async generateReport(
    @Param('customerId') customerId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.paymentHistoryService.generatePaymentReport(
      customerId,
      start,
      end,
    );
  }

  @Get('customer/:customerId/check-month')
  async checkMonthPayment(
    @Param('customerId') customerId: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const hasPaid = await this.paymentHistoryService.hasPaidForMonth(
      customerId,
      year,
      month,
    );

    return { hasPaid, customerId, year, month };
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePaymentRequest(
    @Param('id') id: string,
    @Body() updateData: Partial<CreatePaymentHistoryDto>,
  ) {
    return this.paymentHistoryService.updatePaymentRequest(id, updateData);
  }
}
