import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schemas/expense.schema';
import { Model } from 'mongoose';
import { CreateExpenseDto } from './dtos/expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private ExpenseModel: Model<Expense>,
  ) {}

  async createExpense(expense: CreateExpenseDto) {
    try {
      const createdExpense = new this.ExpenseModel(expense);
      await createdExpense.validate(); // Explicit validation
      return await createdExpense.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Let the MongoExceptionFilter handle it
        throw error;
      }
      if (error.code === 11000) {
        throw new ConflictException('Expense already exists');
      }
      throw error;
    }
  }

  async getExpenses() {
    return this.ExpenseModel.find().exec();
  }

  async getExpenseById(expenseId: string) {
    const expense = await this.ExpenseModel.findById(expenseId).exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async updateExpense(
    expenseId: string,
    updateData: Partial<CreateExpenseDto>,
  ) {
    try {
      const updatedExpense = await this.ExpenseModel.findByIdAndUpdate(
        expenseId,
        updateData,
        { new: true, runValidators: true },
      ).exec();

      if (!updatedExpense) {
        throw new NotFoundException('Expense not found');
      }

      return updatedExpense;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      if (error.code === 11000) {
        throw new ConflictException('Expense with this data already exists');
      }
      throw error;
    }
  }

  async deleteExpense(
    id: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.ExpenseModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return { deleted: true, message: 'Expense deleted successfully' };
  }
}
