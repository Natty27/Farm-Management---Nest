import { Module } from '@nestjs/common';
import { CowsService } from './cows.service';
import { CowsController } from './cows.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cow, CowSchema } from './schemas/cow.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cow.name, schema: CowSchema }])],
  controllers: [CowsController],
  providers: [CowsService],
  exports: [MongooseModule],
})
export class CowsModule {}
