import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { DatasModule } from './data/datas.module';
import { CowsModule } from './cow/cows.module';
import { MilkingRecordsModule } from './milkingRecord/milkingRecords.module';
import { ExpensesModule } from './expense/expenses.module';
import { CustomersModule } from './customer/customers.module';
import { SalesModule } from './sales/sales.module';
import { ReportsModule } from './report/reports.module';
import { PaymentHistoryModule } from './paymentHistory/payment-history.module';
import { ProcessingRecordModule } from './processingRecords/processingRecord.module';
import { MilkInventoryModule } from './milkInventory/milkingInventory.module';
import { MilkProvidersModule } from './milkProvider/milkProviders.module';
import config from './config/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    RolesModule,
    DatasModule,
    CowsModule, // Ensure CowsModule is imported here
    MilkingRecordsModule, // Ensure MilkingRecordsModule is imported here
    ExpensesModule, // Ensure ExpensesModule is imported here
    CustomersModule, // Ensure CustomersModule is imported here
    SalesModule, // Ensure SalesModule is imported here
    ReportsModule, // Ensure ReportsModule is imported here
    PaymentHistoryModule,
    ProcessingRecordModule,
    MilkInventoryModule,
    MilkProvidersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
