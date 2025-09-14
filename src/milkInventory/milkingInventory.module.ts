import { Module } from '@nestjs/common';
import { MilkInventoryService } from './milkInventory.service';
import { MilkInventoryController } from './milkInventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MilkInventory,
  MilkInventorySchema,
} from './schemas/milkInventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MilkInventory.name, schema: MilkInventorySchema },
    ]),
  ],
  controllers: [MilkInventoryController],
  providers: [MilkInventoryService],
  exports: [MilkInventoryService],
})
export class MilkInventoryModule {}
