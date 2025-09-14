import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Patch,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dtos/expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createExpense(@Body() expense: CreateExpenseDto) {
    return this.expensesService.createExpense(expense);
  }

  @Get()
  async getExpenses() {
    return this.expensesService.getExpenses();
  }

  @Get(':id')
  async getExpense(@Param('id') id: string) {
    return this.expensesService.getExpenseById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateExpense(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateExpenseDto>,
  ) {
    return this.expensesService.updateExpense(id, updateData);
  }

  @Delete(':id')
  async deleteExpense(@Param('id') id: string) {
    try {
      return await this.expensesService.deleteExpense(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
