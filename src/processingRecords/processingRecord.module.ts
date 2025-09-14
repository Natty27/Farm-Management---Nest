import { Module } from '@nestjs/common';
import { ProcessingService } from './processingRecord.service';
import { ProcessingController } from './processingRecord.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Processing,
  ProcessingSchema,
} from './schemas/processingRecord.schema';
import { MilkInventoryModule } from './../milkInventory/milkingInventory.module'; // ✅ correct path

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Processing.name, schema: ProcessingSchema },
    ]),
    MilkInventoryModule, // ✅ add this
  ],
  controllers: [ProcessingController],
  providers: [ProcessingService],
  exports: [ProcessingService],
})
export class ProcessingRecordModule {}
