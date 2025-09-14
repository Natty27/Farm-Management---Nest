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
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { MilkProvidersService } from './milkProviders.service';
import { CreateMilkProviderDto } from './dtos/milkProvider.dto';

@Controller('milkProviders')
export class MilkProvidersController {
  constructor(private readonly milkProvidersService: MilkProvidersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createMilkProvider(@Body() milkProvider: CreateMilkProviderDto) {
    return this.milkProvidersService.createMilkProvider(milkProvider);
  }

  @Get()
  async getMilkProviders() {
    return this.milkProvidersService.getMilkProviders();
  }

  @Get(':id')
  async getMilkProvider(@Param('id') id: string) {
    return this.milkProvidersService.getMilkProviderById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateMilkProvider(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateMilkProviderDto>,
  ) {
    return this.milkProvidersService.updateMilkProvider(id, updateData);
  }

  @Delete(':id')
  async deleteMilkProvider(@Param('id') id: string) {
    try {
      return await this.milkProvidersService.deleteMilkProvider(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
