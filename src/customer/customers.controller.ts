import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Patch,
  NotFoundException,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/customer.dto';
import { CustomerStatus } from './schemas/customer.schema';
import { ProcessPaymentDto } from './dtos/process-payment.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomer(@Body() customer: CreateCustomerDto) {
    return this.customersService.createCustomer(customer);
  }

  @Get()
  async getCustomers() {
    return this.customersService.getCustomers();
  }

  // New endpoint to get customers by status
  @Get('status/:status')
  async getCustomersByStatus(@Param('status') status: CustomerStatus) {
    return this.customersService.getCustomersByStatus(status);
  }

  @Get('alerts/overdue')
  async getOverdueAlerts() {
    return this.customersService.getOverdueContractCustomers();
  }

  @Get('overdue')
  async getOverdueCustomers() {
    return this.customersService.getOverdueCustomers();
  }

  // New endpoint to manually trigger overdue check (for testing/admin purposes)
  @Post('alerts/overdue/check')
  @HttpCode(HttpStatus.OK)
  async triggerOverdueCheck() {
    return this.customersService.handleOverdueCustomers();
  }

  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    return this.customersService.getCustomerById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateCustomerDto>,
  ) {
    return this.customersService.updateCustomer(id, updateData);
  }

  // New endpoint to update customer status specifically
  @Patch(':id/status')
  async updateCustomerStatus(
    @Param('id') id: string,
    @Body('status') status: CustomerStatus,
  ) {
    return this.customersService.updateCustomerStatus(id, status);
  }

  @Post(':id/payment')
  async processPayment(
    @Param('id') id: string,
    @Body()
    paymentData: { amount: number; paymentDate?: Date; paymentMethod?: string }, // Make amount required
  ) {
    console.log('Received payment data:', paymentData); // Add logging

    if (!paymentData || !paymentData.amount) {
      throw new BadRequestException('Amount is required');
    }

    return this.customersService.processPayment(
      id,
      paymentData.amount, // This should be a number
      paymentData.paymentDate || new Date(),
      paymentData.paymentMethod,
    );
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    try {
      return await this.customersService.deleteCustomer(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
