import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Cow } from './../../cow/schemas/cow.schema'; // import your Cow schema
import { User } from './../../auth/schemas/user.schema'; // import your User schema

export enum MilkingTime {
  MORNING = 'morning',
  EVENING = 'evening',
}

@Schema({ timestamps: true }) // Adding timestamps for createdAt and updatedAt
export class MilkingRecord {
  @Prop({ type: Types.ObjectId, ref: 'Cow', required: true })
  cow_id: Types.ObjectId; // Reference to Cow document

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

  @Prop({ type: String })
  notes: string;

  @Prop({ type: Number })
  fat_percentage?: number; // optional

  @Prop({ type: Number })
  snf?: number; // optional (Solid Not Fat)

  @Prop({ type: Number })
  temperature?: number; // optional

  @Prop({ type: Types.ObjectId, ref: 'User' })
  added_by?: Types.ObjectId; // optional reference to User who added the record
}

export const MilkingRecordSchema = SchemaFactory.createForClass(MilkingRecord);
