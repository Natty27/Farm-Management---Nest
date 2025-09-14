import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaymentHistory,
  PaymentStatus,
} from './schemas/payment-history.schema';
import { CreatePaymentHistoryDto } from './dtos/payment-history.dto';
import { CounterService } from './../counter.service';

@Injectable()
export class PaymentHistoryService {
  constructor(
    @InjectModel(PaymentHistory.name)
    private paymentHistoryModel: Model<PaymentHistory>,
    private counterService: CounterService, // Remove CustomerModel dependency from here
  ) {}

  async createPaymentHistory(createDto: CreatePaymentHistoryDto) {
    // Generate reference number
    const referenceNumber =
      await this.counterService.generatePaymentReference();

    const paymentHistory = new this.paymentHistoryModel({
      ...createDto,
      referenceNumber,
    });

    return await paymentHistory.save();
    // Remove the customer update logic from here
  }

  async getPaymentHistorys() {
    return this.paymentHistoryModel
      .find()
      .populate('customerId', 'name lastPaymentDate') // only include name field
      .exec();
  }

  // Keep other methods that don't require CustomerModel
  async getCustomerPaymentHistory(customerId: string) {
    return this.paymentHistoryModel
      .find({ customerId })
      .sort({ paymentDate: -1 })
      .exec();
  }

  async getPaymentHistoryByDateRange(
    customerId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.paymentHistoryModel
      .find({
        customerId,
        paymentDate: { $gte: startDate, $lte: endDate },
      })
      .sort({ paymentDate: -1 })
      .exec();
  }

  async hasPaidForMonth(customerId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const payment = await this.paymentHistoryModel.findOne({
      customerId,
      paymentDate: { $gte: startDate, $lte: endDate },
      status: PaymentStatus.SUCCESS,
    });

    return !!payment;
  }

  async generatePaymentReport(
    customerId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const query: any = { customerId, status: PaymentStatus.SUCCESS };

    if (startDate && endDate) {
      query.paymentDate = { $gte: startDate, $lte: endDate };
    }

    const payments = await this.paymentHistoryModel
      .find(query)
      .sort({ paymentDate: -1 })
      .exec();

    const totalAmount = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    return {
      payments,
      totalAmount,
      paymentCount: payments.length,
      period: startDate && endDate ? { startDate, endDate } : 'All time',
    };
  }

  async updatePaymentRequest(
    customerId: string,
    updateData: Partial<CreatePaymentHistoryDto>,
  ) {
    try {
      const updatedPaymentRequest = await this.paymentHistoryModel
        .findByIdAndUpdate(customerId, updateData, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedPaymentRequest) {
        throw new NotFoundException('Customer not found');
      }

      return updatedPaymentRequest;
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
}
