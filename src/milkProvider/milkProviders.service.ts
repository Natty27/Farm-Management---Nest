import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MilkProvider,
  MilkProviderDocument,
} from './schemas/milkProvider.schema';
import { CreateMilkProviderDto } from './dtos/milkProvider.dto';
import { MilkInventoryService } from './../milkInventory/milkInventory.service';

@Injectable()
export class MilkProvidersService {
  constructor(
    @InjectModel(MilkProvider.name)
    private milkProviderModel: Model<MilkProviderDocument>, // ✅ now typed correctly

    private readonly milkInventoryService: MilkInventoryService,
  ) {}

  async createMilkProvider(milkProvider: CreateMilkProviderDto) {
    try {
      const createdMilkProvider = new this.milkProviderModel(milkProvider);
      await createdMilkProvider.validate();

      const savedRecord = await createdMilkProvider.save();

      return savedRecord;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      if (error.code === 11000) {
        throw new ConflictException('MilkProvider already exists');
      }
      throw error;
    }
  }

  async getMilkProviders() {
    return this.milkProviderModel.find().exec();
  }

  async getMilkProviderById(milkProviderId: string) {
    const milkProvider = await this.milkProviderModel
      .findById(milkProviderId)
      .exec();
    if (!milkProvider) {
      throw new NotFoundException('MilkProvider not found');
    }
    return milkProvider;
  }

  async updateMilkProvider(
    milkProviderId: string,
    updateData: Partial<CreateMilkProviderDto>,
  ) {
    try {
      const updatedMilkProvider = await this.milkProviderModel
        .findByIdAndUpdate(milkProviderId, updateData, {
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
  async deleteMilkProvider(
    id: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.milkProviderModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Cow with ID ${id} not found`);
    }

    return { deleted: true, message: 'Cow deleted successfully' };
  }
}
