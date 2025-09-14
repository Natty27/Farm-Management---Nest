import { Module } from '@nestjs/common';
import { PaymentHistoryService } from './payment-history.service';
import { PaymentHistoryController } from './payment-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentHistory,
  PaymentHistorySchema,
} from './schemas/payment-history.schema';
import { Counter, CounterSchema } from './../counter.schema';
import { CounterService } from './../counter.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentHistory.name, schema: PaymentHistorySchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService, CounterService],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
