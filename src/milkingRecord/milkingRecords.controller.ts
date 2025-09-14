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
import { MilkingRecordsService } from './milkingRecords.service';
import { CreateMilkingRecordDto } from './dtos/milkingRecord.dto';

@Controller('milkingRecords')
export class MilkingRecordsController {
  constructor(private readonly milkingRecordsService: MilkingRecordsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createMilkingRecord(@Body() milkingRecord: CreateMilkingRecordDto) {
    return this.milkingRecordsService.createMilkingRecord(milkingRecord);
  }

  @Get()
  async getMilkingRecords() {
    return this.milkingRecordsService.getMilkingRecords();
  }

  @Get(':id')
  async getMilkingRecord(@Param('id') id: string) {
    return this.milkingRecordsService.getMilkingRecordById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateMilkingRecord(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateMilkingRecordDto>,
  ) {
    return this.milkingRecordsService.updateMilkingRecord(id, updateData);
  }

  @Delete(':id')
  async deleteMilkingRecord(@Param('id') id: string) {
    try {
      return await this.milkingRecordsService.deleteMilkingRecord(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
