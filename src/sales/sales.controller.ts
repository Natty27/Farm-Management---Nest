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
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dtos/sales.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createSale(@Body() sale: CreateSaleDto) {
    return this.salesService.createSale(sale);
  }

  @Get()
  async getSales() {
    return this.salesService.getSales();
  }

  @Get(':id')
  async getSale(@Param('id') id: string) {
    return this.salesService.getSaleById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSale(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateSaleDto>,
  ) {
    return this.salesService.updateSale(id, updateData);
  }

  @Delete(':id')
  async deleteSale(@Param('id') id: string) {
    try {
      return await this.salesService.deleteSale(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
