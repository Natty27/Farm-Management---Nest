// schemas/milk-inventory.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MilkInventoryDocument = MilkInventory & Document;

@Schema({ timestamps: true })
export class MilkInventory {
  @Prop({ required: true })
  date: Date;

  @Prop({ default: 0 })
  openingBalanceLiters: number;

  @Prop({ default: 0 })
  collectedLiters: number;

  @Prop({ default: 0 })
  soldLiters: number;

  @Prop({ default: 0 })
  processedLiters: number;

  @Prop({ default: 0 })
  closingBalanceLiters: number;
}

export const MilkInventorySchema = SchemaFactory.createForClass(MilkInventory);
