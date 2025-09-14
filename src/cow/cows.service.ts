import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cow } from './schemas/cow.schema';
import { Model } from 'mongoose';
import { CreateCowDto } from './dtos/cow.dto';

@Injectable()
export class CowsService {
  constructor(@InjectModel(Cow.name) private CowModel: Model<Cow>) {}

  async createCow(cow: CreateCowDto) {
    try {
      const createdCow = new this.CowModel(cow);
      await createdCow.validate(); // Explicit validation
      return await createdCow.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Let the MongoExceptionFilter handle it
        throw error;
      }
      if (error.code === 11000) {
        throw new ConflictException('Cow already exists');
      }
      throw error;
    }
  }

  async getCows() {
    return this.CowModel.find().exec();
  }

  async getCowById(cowId: string) {
    const cow = await this.CowModel.findById(cowId).exec();
    if (!cow) {
      throw new NotFoundException('Cow not found');
    }
    return cow;
  }

  async updateCow(cowId: string, updateData: Partial<CreateCowDto>) {
    try {
      const updatedCow = await this.CowModel.findByIdAndUpdate(
        cowId,
        updateData,
        { new: true, runValidators: true },
      ).exec();

      if (!updatedCow) {
        throw new NotFoundException('Cow not found');
      }

      return updatedCow;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      if (error.code === 11000) {
        throw new ConflictException('Cow with this data already exists');
      }
      throw error;
    }
  }
}
