import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Cow } from './../../cow/schemas/cow.schema';
import { User } from './../../auth/schemas/user.schema';
import { MilkProvider } from './../../milkProvider/schemas/milkProvider.schema';

export enum MilkingTime {
  MORNING = 'morning',
  EVENING = 'evening',
}

export enum MilkSourceType {
  OWN_FARM = 'own_farm',
  EXTERNAL_PROVIDER = 'external_provider',
}

@Schema({ timestamps: true })
export class MilkingRecord {
  @Prop({
    type: String,
    enum: MilkSourceType,
    required: true,
    default: MilkSourceType.OWN_FARM,
  })
  source_type: MilkSourceType;

  @Prop({ type: Types.ObjectId, ref: Cow.name, required: false })
  cow_id?: Types.ObjectId; // Only for own farm milk

  @Prop({ type: Types.ObjectId, ref: MilkProvider.name, required: false })
  provider_id?: Types.ObjectId; // Only for external provider milk

  @Prop({ type: Date, required: true, default: Date.now })
  date: Date;

  @Prop({
    type: String,
    enum: MilkingTime,
    required: true,
  })
  time: MilkingTime;

  @Prop({ type: Number, required: true })
  amount: number; // in liters

  @Prop({ type: Number, required: false })
  cost_price?: number; // purchase cost per liter (only for external milk)

  @Prop({ type: String, required: false })
  notes?: string;

  @Prop({ type: Number, required: false })
  fat_percentage?: number;

  @Prop({ type: Number, required: false })
  snf?: number;

  @Prop({ type: Number, required: false })
  temperature?: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  added_by?: Types.ObjectId;
}

export type MilkingRecordDocument = MilkingRecord & Document;
export const MilkingRecordSchema = SchemaFactory.createForClass(MilkingRecord);
