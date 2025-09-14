// services/milk-inventory.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MilkInventory,
  MilkInventoryDocument,
} from './schemas/milkInventory.schema';
import { CreateMilkInventoryDto } from './dtos/milkInventory.dto';
import { startOfDay, subDays } from 'date-fns';

@Injectable()
export class MilkInventoryService {
  constructor(
    @InjectModel(MilkInventory.name)
    private milkInventoryModel: Model<MilkInventoryDocument>,
  ) {}

  async findAll(): Promise<MilkInventoryDocument[]> {
    return this.milkInventoryModel.find().sort({ date: -1 }).exec();
  }

  async findOrCreateByDate(date: Date): Promise<MilkInventoryDocument> {
    let record = await this.milkInventoryModel.findOne({ date }).exec();
    if (!record) {
      record = new this.milkInventoryModel({
        date,
        openingBalanceLiters: 0,
        collectedLiters: 0,
        soldLiters: 0,
        processedLiters: 0,
        closingBalanceLiters: 0,
      });
      await record.save();
    }
    return record;
  }

  async updateInventory(
    date: Date,
    data: {
      collectedLiters?: number;
      soldLiters?: number;
      processedLiters?: number;
    },
  ) {
    const day = startOfDay(date);

    // 🔹 Get today's inventory
    let inventory = await this.milkInventoryModel.findOne({ date: day });

    // 🔹 If no inventory exists, create new one
    if (!inventory) {
      // Get previous day's closing balance
      const yesterday = startOfDay(subDays(day, 1));
      const prevInventory = await this.milkInventoryModel.findOne({
        date: yesterday,
      });

      const openingBalance = prevInventory
        ? prevInventory.closingBalanceLiters
        : 0;

      inventory = new this.milkInventoryModel({
        date: day,
        openingBalanceLiters: openingBalance,
        collectedLiters: 0,
        soldLiters: 0,
        processedLiters: 0,
        closingBalanceLiters: openingBalance,
      });
    }

    // 🔹 Update fields
    if (data.collectedLiters) {
      inventory.collectedLiters += data.collectedLiters;
    }
    if (data.soldLiters) {
      inventory.soldLiters += data.soldLiters;
    }
    if (data.processedLiters) {
      inventory.processedLiters += data.processedLiters;
    }

    // 🔹 Recalculate closing balance
    inventory.closingBalanceLiters =
      inventory.openingBalanceLiters +
      inventory.collectedLiters -
      inventory.soldLiters -
      inventory.processedLiters;

    // 🔹 Save changes
    await inventory.save();

    return inventory;
  }
}
