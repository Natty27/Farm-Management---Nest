// controllers/processing.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProcessingService } from './processingRecord.service';
import { CreateProcessingDto } from './dtos/processingRecords.dto';
import { CreateMilkProviderDto } from 'src/milkProvider/dtos/milkProvider.dto';

@Controller('processing')
export class ProcessingController {
  constructor(private readonly processingService: ProcessingService) {}

  @Post()
  async create(@Body() dto: CreateProcessingDto) {
    return this.processingService.create(dto);
  }

  @Get()
  async findAll() {
    return this.processingService.findAll();
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProcessing(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateProcessingDto>,
  ) {
    return this.processingService.updateProcessing(id, updateData);
  }
}
