import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { PaymentHistoryModule } from './../paymentHistory/payment-history.module'; // Import PaymentHistoryModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    PaymentHistoryModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [MongooseModule],
})
export class CustomersModule {}
