// customer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum CustomerType {
  REGULAR = 'regular',
  CONTRACT = 'contract',
}

export enum CustomerStatus {
  ACTIVE = 'active',
  OVERDUE = 'overdue',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  amount?: number;

  @Prop()
  address?: string;

  @Prop({ enum: CustomerType, default: CustomerType.REGULAR })
  type: CustomerType;

  @Prop({ enum: CustomerStatus, default: CustomerStatus.ACTIVE })
  status: CustomerStatus;

  @Prop()
  monthlyPayment?: number;

  @Prop({ min: 1, max: 31 })
  monthlyDueDay?: number;

  @Prop()
  contractDuration?: number;

  @Prop()
  lastPaymentDate?: Date;

  @Prop()
  nextPaymentDate?: Date;

  @Prop({ type: [Types.ObjectId], ref: 'PaymentHistory', default: [] })
  paymentHistories: Types.ObjectId[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
