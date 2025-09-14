// sales.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MilkingTime } from 'src/milkingRecord/schemas/milkingRecord.schema';

export enum ProductType {
  MILK = 'milk',
  BUTTER = 'butter',
  CHEESE = 'cheese',
  COW = 'cow',
  MANURE = 'manure',
  OTHERS = 'others',
}

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({
    type: String,
    enum: ProductType,
    required: true,
  })
  product_type: ProductType;

  @Prop({
    type: String,
    enum: MilkingTime,
    required: true,
  })
  shift: MilkingTime;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit_price: number;

  @Prop({ required: true })
  total_amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  notes?: string;

  @Prop({ type: String, enum: ['cash', 'credit', 'online'], required: true })
  payment_method: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
