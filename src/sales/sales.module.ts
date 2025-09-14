import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from './schemas/sales.schema';
import { MilkInventoryModule } from './../milkInventory/milkingInventory.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    MilkInventoryModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [MongooseModule],
})
export class SalesModule {}
