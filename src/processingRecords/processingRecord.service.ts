// services/processing.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Processing,
  ProcessingDocument,
} from './schemas/processingRecord.schema';
import { CreateProcessingDto } from './dtos/processingRecords.dto';
import { MilkInventoryService } from './../milkInventory/milkInventory.service';
import { CreateMilkProviderDto } from 'src/milkProvider/dtos/milkProvider.dto';

@Injectable()
export class ProcessingService {
  constructor(
    @InjectModel(Processing.name)
    private processingModel: Model<ProcessingDocument>,
    private milkInventoryService: MilkInventoryService,
  ) {}

  async create(dto: CreateProcessingDto): Promise<Processing> {
    const processing = new this.processingModel(dto);
    await processing.save();

    await this.milkInventoryService.updateInventory(dto.date, {
      processedLiters: dto.milkUsedLiters,
    });

    return processing;
  }

  async findAll(): Promise<Processing[]> {
    return this.processingModel.find().exec();
  }

  async updateProcessing(
    processingId: string,
    updateData: Partial<CreateProcessingDto>,
  ) {
    try {
      const updatedMilkProvider = await this.processingModel
        .findByIdAndUpdate(processingId, updateData, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedMilkProvider) {
        throw new NotFoundException('MilkProvider not found');
      }

      return updatedMilkProvider;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      if (error.code === 11000) {
        throw new ConflictException(
          'MilkProvider with this data already exists',
        );
      }
      throw error;
    }
  }
}
