// controllers/milk-inventory.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { MilkInventoryService } from './milkInventory.service';

@Controller('milk-inventory')
export class MilkInventoryController {
  constructor(private readonly milkInventoryService: MilkInventoryService) {}

  @Get(':date')
  async getInventory(@Param('date') date: string) {
    return this.milkInventoryService.findOrCreateByDate(new Date(date));
  }
}
