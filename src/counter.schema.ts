import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'counters' })
export class Counter extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 0 })
  sequence: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
