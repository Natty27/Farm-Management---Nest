import { Module } from '@nestjs/common';
import { MilkProvidersService } from './milkProviders.service';
import { MilkProvidersController } from './milkProviders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MilkProvider,
  MilkProviderSchema,
} from './schemas/milkProvider.schema';

import { MilkInventoryModule } from './../milkInventory/milkingInventory.module'; // ✅ import the module

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MilkProvider.name, schema: MilkProviderSchema },
    ]),
    MilkInventoryModule, // ✅ add this
  ],
  controllers: [MilkProvidersController],
  providers: [MilkProvidersService],
  exports: [MongooseModule, MilkProvidersService],
})
export class MilkProvidersModule {}
