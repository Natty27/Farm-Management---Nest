import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
//import { Report, ReportSchema } from './schemas/report.schema';
import { CowsModule } from '../cow/cows.module';
import { CustomersModule } from '../customer/customers.module';
import { ExpensesModule } from '../expense/expenses.module';
import { MilkingRecordsModule } from '../milkingRecord/milkingRecords.module';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [
    CowsModule,
    CustomersModule,
    ExpensesModule,
    MilkingRecordsModule,
    SalesModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
