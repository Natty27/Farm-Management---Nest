import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dtos/customer.dto';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import {
  Customer,
  CustomerStatus,
  CustomerType,
} from './schemas/customer.schema';
import { PaymentHistoryService } from './../paymentHistory/payment-history.service';
import { PaymentStatus } from 'src/paymentHistory/schemas/payment-history.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,
    private paymentHistoryService: PaymentHistoryService, // Add this
  ) {}

  async createCustomer(customer: CreateCustomerDto) {
    try {
      const createdCustomer = new this.CustomerModel(customer);
      await createdCustomer.validate(); // Explicit validation
      return await createdCustomer.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Let the MongoExceptionFilter handle it
        throw error;
      }
      if (error.code === 11000) {
        throw new ConflictException('Customer already exists');
      }
      throw error;
    }
  }

  async getCustomers() {
    return this.CustomerModel.find().exec();
  }

  async getCustomerById(customerId: string) {
    const customer = await this.CustomerModel.findById(customerId).exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async updateCustomer(
    customerId: string,
    updateData: Partial<CreateCustomerDto>,
  ) {
    try {
      const updatedCustomer = await this.CustomerModel.findByIdAndUpdate(
        customerId,
        updateData,
        { new: true, runValidators: true },
      ).exec();

      if (!updatedCustomer) {
        throw new NotFoundException('Customer not found');
      }

      return updatedCustomer;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      if (error.code === 11000) {
        throw new ConflictException('Customer with this data already exists');
      }
      throw error;
    }
  }

  async deleteCustomer(
    id: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.CustomerModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return { deleted: true, message: 'Customer deleted successfully' };
  }

  // Scheduled task to check and update overdue customers daily at 9 AM
  @Interval(3000000) // 30 seconds in milliseconds
  async handleOverdueCustomers() {
    console.log('Running scheduled overdue customer check every 30 seconds...');
    const overdueCustomers = await this.getOverdueContractCustomers();

    // Update status of overdue customers
    for (const customer of overdueCustomers) {
      await this.CustomerModel.findByIdAndUpdate(
        customer._id,
        { status: CustomerStatus.OVERDUE },
        { new: true },
      );
    }

    console.log(
      `Updated ${overdueCustomers.length} customers to OVERDUE status`,
    );
    return overdueCustomers;
  }

  async getOverdueContractCustomers(): Promise<Customer[]> {
    const today = new Date();
    const contractCustomers = await this.CustomerModel.find({
      type: CustomerType.CONTRACT,
      status: CustomerStatus.ACTIVE, // Only check active customers
    }).exec();

    const overdueCustomers = contractCustomers.filter((customer) => {
      if (!customer.monthlyDueDay || !customer.lastPaymentDate) return false;

      // Calculate this month's due date
      const dueDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        customer.monthlyDueDay,
      );

      // If due date is in the future, not overdue
      if (today < dueDate) return false;

      // If last payment was before this month's due date, it's overdue
      return customer.lastPaymentDate < dueDate;
    });

    return overdueCustomers;
  }

  async getOverdueCustomers(): Promise<Customer[]> {
    const today = new Date();
    const contractCustomers = await this.CustomerModel.find({
      type: CustomerType.CONTRACT,
      status: CustomerStatus.OVERDUE, // Only check active customers
    }).exec();

    return contractCustomers;
  }

  // Additional method to get all customers by status
  async getCustomersByStatus(status: CustomerStatus): Promise<Customer[]> {
    return this.CustomerModel.find({ status }).exec();
  }

  // Method to update customer status manually if needed
  async updateCustomerStatus(
    customerId: string,
    status: CustomerStatus,
  ): Promise<Customer> {
    return this.CustomerModel.findByIdAndUpdate(
      customerId,
      { status },
      { new: true },
    ).exec();
  }

  async processPayment(
    customerId: string,
    amount: number,
    paymentDate: Date = new Date(),
    paymentMethod?: string,
  ): Promise<Customer> {
    const customer = await this.CustomerModel.findById(customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Create payment history
    const paymentHistory =
      await this.paymentHistoryService.createPaymentHistory({
        customerId,
        amount,
        paymentDate,
        status: PaymentStatus.SUCCESS,
        paymentMethod,
      });

    // Update customer with payment history reference and status
    const updatedCustomer = await this.CustomerModel.findByIdAndUpdate(
      customerId,
      {
        $push: { paymentHistories: paymentHistory._id },
        lastPaymentDate: paymentDate,
        status: CustomerStatus.ACTIVE,
      },
      { new: true },
    ).exec();

    return updatedCustomer;
  }

  // Add this method to check if customer has paid for current month
  async hasPaidForCurrentMonth(customerId: string): Promise<boolean> {
    const today = new Date();
    return this.paymentHistoryService.hasPaidForMonth(
      customerId,
      today.getFullYear(),
      today.getMonth() + 1,
    );
  }
}
