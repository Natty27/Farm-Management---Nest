import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PaymentStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class PaymentHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.SUCCESS,
  })
  status: PaymentStatus;

  @Prop()
  referenceNumber?: string;

  @Prop()
  paymentMethod?: string;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PaymentHistorySchema =
  SchemaFactory.createForClass(PaymentHistory);

// Index for better query performance
PaymentHistorySchema.index({ customerId: 1, paymentDate: -1 });
PaymentHistorySchema.index({ paymentDate: 1 });
