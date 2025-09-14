import { Module } from '@nestjs/common';
import { MilkingRecordsService } from './milkingRecords.service';
import { MilkingRecordsController } from './milkingRecords.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MilkingRecord,
  MilkingRecordSchema,
} from './schemas/milkingRecord.schema';

import { MilkInventoryModule } from './../milkInventory/milkingInventory.module'; // ✅ import the module

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MilkingRecord.name, schema: MilkingRecordSchema },
    ]),
    MilkInventoryModule, // ✅ add this
  ],
  controllers: [MilkingRecordsController],
  providers: [MilkingRecordsService],
  exports: [MongooseModule, MilkingRecordsService],
})
export class MilkingRecordsModule {}
