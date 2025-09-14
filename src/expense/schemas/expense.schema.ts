import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpenseCategory, ExpenseType } from './../dtos/expense.dto';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({
    type: String,
    enum: ExpenseType,
    required: true,
  })
  type: ExpenseType;

  @Prop({
    type: String,
    enum: ExpenseCategory,
    required: true,
  })
  category: ExpenseCategory;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  description?: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

export { ExpenseCategory, ExpenseType };
