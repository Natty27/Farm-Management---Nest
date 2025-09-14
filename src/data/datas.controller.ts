import { Body, Controller, Post } from '@nestjs/common';
import { DatasService } from './datas.service';
import { CreateDataDto } from './dtos/data.dto';

@Controller('datas')
export class DatasController {
  constructor(private readonly datasService: DatasService) {}

  @Post()
  async createData(@Body() data: CreateDataDto) {
    return this.datasService.createData(data);
  }
}
