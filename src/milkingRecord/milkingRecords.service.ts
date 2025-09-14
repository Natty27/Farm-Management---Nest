import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MilkingRecord,
  MilkingRecordDocument,
} from './schemas/milkingRecord.schema';
import { CreateMilkingRecordDto } from './dtos/milkingRecord.dto';
import { MilkInventoryService } from './../milkInventory/milkInventory.service';

@Injectable()
export class MilkingRecordsService {
  constructor(
    @InjectModel(MilkingRecord.name)
    private milkingRecordModel: Model<MilkingRecordDocument>, // ✅ now typed correctly

    private readonly milkInventoryService: MilkInventoryService,
  ) {}

  async createMilkingRecord(milkingRecord: CreateMilkingRecordDto) {
    try {
      const createdMilkingRecord = new this.milkingRecordModel(milkingRecord);
      await createdMilkingRecord.validate();

      const savedRecord = await createdMilkingRecord.save();

      await this.milkInventoryService.updateInventory(
        milkingRecord.date ?? new Date(),
        { collectedLiters: milkingRecord.amount },
      );

      return savedRecord;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      if (error.code === 11000) {
        throw new ConflictException('MilkingRecord already exists');
      }
      throw error;
    }
  }

  async getMilkingRecords() {
    return this.milkingRecordModel
      .find()
      .populate('cow_id', 'name breed status') // populate cow details
      .populate('provider_id', 'name') // populate provider details
      .exec();
  }

  async getMilkingRecordById(milkingRecordId: string) {
    const milkingRecord = await this.milkingRecordModel
      .findById(milkingRecordId)
      .exec();
    if (!milkingRecord) {
      throw new NotFoundException('MilkingRecord not found');
    }
    return milkingRecord;
  }

  async updateMilkingRecord(
    milkingRecordId: string,
    updateData: Partial<CreateMilkingRecordDto>,
  ) {
    try {
      const updatedMilkingRecord = await this.milkingRecordModel
        .findByIdAndUpdate(milkingRecordId, updateData, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedMilkingRecord) {
        throw new NotFoundException('MilkingRecord not found');
      }

      return updatedMilkingRecord;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      if (error.code === 11000) {
        throw new ConflictException(
          'MilkingRecord with this data already exists',
        );
      }
      throw error;
    }
  }
  async deleteMilkingRecord(
    id: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.milkingRecordModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Cow with ID ${id} not found`);
    }

    return { deleted: true, message: 'Cow deleted successfully' };
  }
}
