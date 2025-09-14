import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sale } from './schemas/sales.schema';
import { Model } from 'mongoose';
import { CreateSaleDto } from './dtos/sales.dto';
import { MilkInventoryService } from './../milkInventory/milkInventory.service'; // ✅ import service

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private SaleModel: Model<Sale>,
    private readonly milkInventoryService: MilkInventoryService, // ✅ inject here
  ) {}

  async createSale(sale: CreateSaleDto) {
    try {
      const createdSale = new this.SaleModel(sale);
      await createdSale.validate();
      const savedSale = await createdSale.save();

      // ✅ Update Milk Inventory after sale
      await this.milkInventoryService.updateInventory(savedSale.date, {
        soldLiters: savedSale.quantity,
      });

      return savedSale;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      if (error.code === 11000) {
        throw new ConflictException('Sale already exists');
      }
      throw error;
    }
  }

  async getSales() {
    return this.SaleModel.find()
      .populate('customer') // Assuming 'customer' is the field name that references the Customer model
      .exec();
  }

  async getSaleById(saleId: string) {
    const sale = await this.SaleModel.findById(saleId).exec();
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }
    return sale;
  }

  async updateSale(saleId: string, updateData: Partial<CreateSaleDto>) {
    try {
      const updatedSale = await this.SaleModel.findByIdAndUpdate(
        saleId,
        updateData,
        { new: true, runValidators: true },
      ).exec();

      if (!updatedSale) {
        throw new NotFoundException('Sale not found');
      }

      return updatedSale;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      if (error.code === 11000) {
        throw new ConflictException('Sale with this data already exists');
      }
      throw error;
    }
  }

  async deleteSale(
    id: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.SaleModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return { deleted: true, message: 'Sale deleted successfully' };
  }
}
