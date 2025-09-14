import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from './counter.schema';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
  ) {}

  async getNextSequence(name: string): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true },
    );

    return counter.sequence;
  }

  async generatePaymentReference(): Promise<string> {
    const sequence = await this.getNextSequence('payment');
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `PAY${year}${month}${day}${sequence.toString().padStart(6, '0')}`;
  }
}
