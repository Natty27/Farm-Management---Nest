import { Module } from '@nestjs/common';
import { DatasService } from './datas.service';
import { DatasController } from './datas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Data, DataSchema } from './schemas/data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Data.name, schema: DataSchema }]),
  ],
  controllers: [DatasController],
  providers: [DatasService],
  exports: [DatasService],
})
export class DatasModule {}
