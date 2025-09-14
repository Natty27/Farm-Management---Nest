import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Data } from './schemas/data.schema';
import { Model } from 'mongoose';
import { CreateDataDto } from './dtos/data.dto';

@Injectable()
export class DatasService {
  constructor(@InjectModel(Data.name) private DataModel: Model<Data>) {}

  async createData(data: CreateDataDto) {
    //TODO: Validate unique names
    return this.DataModel.create(data);
  }

  async getDataById(dataId: string) {
    return this.DataModel.findById(dataId);
  }
}
