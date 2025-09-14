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
} from '@nestjs/common';
import { CowsService } from './cows.service';
import { CreateCowDto } from './dtos/cow.dto';

@Controller('cows')
export class CowsController {
  constructor(private readonly cowsService: CowsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCow(@Body() cow: CreateCowDto) {
    return this.cowsService.createCow(cow);
  }

  @Get()
  async getCows() {
    return this.cowsService.getCows();
  }

  @Get(':id')
  async getCow(@Param('id') id: string) {
    return this.cowsService.getCowById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCow(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateCowDto>,
  ) {
    return this.cowsService.updateCow(id, updateData);
  }
}
