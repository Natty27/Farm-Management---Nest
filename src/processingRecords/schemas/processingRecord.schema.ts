// schemas/processing.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductType } from './../../sales/dtos/sales.dto';

export type ProcessingDocument = Processing & Document;

@Schema({ timestamps: true })
export class Processing {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  milkUsedLiters: number;

  @Prop({ required: true, enum: ProductType })
  productType: ProductType;

  @Prop({ required: true })
  outputQuantity: number;
}

export const ProcessingSchema = SchemaFactory.createForClass(Processing);
