import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MilkProvider {
  @Prop({ required: true })
  name: string;

  @Prop()
  contact_person: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  quality_rating: number; // 1-5 rating system
}

export type MilkProviderDocument = MilkProvider & Document;
export const MilkProviderSchema = SchemaFactory.createForClass(MilkProvider);
