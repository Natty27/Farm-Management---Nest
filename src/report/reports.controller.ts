// reports.controller.ts
import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReportsService, DateRange } from './reports.service';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reports')
@Controller('reports')
@UsePipes(new ValidationPipe({ transform: true }))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  private parseDate(dateString: string): Date | undefined {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  }

  @Get('expenses')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiOperation({ summary: 'Get expense report with optional date range' })
  @ApiResponse({
    status: 200,
    description: 'Expense report retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  async getExpenseReport(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    const startDate = this.parseDate(startDateStr);
    const endDate = this.parseDate(endDateStr);

    if (startDateStr && !startDate)
      throw new Error('Invalid start date format');
    if (endDateStr && !endDate) throw new Error('Invalid end date format');

    const dateRange = startDate && endDate ? { startDate, endDate } : undefined;
    return this.reportsService.getExpenseReport(dateRange);
  }

  @Get('revenue')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiOperation({ summary: 'Get revenue report with optional date range' })
  @ApiResponse({
    status: 200,
    description: 'Revenue report retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  async getRevenueReport(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    const startDate = this.parseDate(startDateStr);
    const endDate = this.parseDate(endDateStr);

    if (startDateStr && !startDate)
      throw new Error('Invalid start date format');
    if (endDateStr && !endDate) throw new Error('Invalid end date format');

    const dateRange = startDate && endDate ? { startDate, endDate } : undefined;
    return this.reportsService.getRevenueReport(dateRange);
  }

  @Get('profit-loss')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiOperation({
    summary: 'Get profit and loss report with optional date range',
  })
  @ApiResponse({
    status: 200,
    description: 'Profit and loss report retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  async getProfitLossReport(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    const startDate = this.parseDate(startDateStr);
    const endDate = this.parseDate(endDateStr);

    if (startDateStr && !startDate)
      throw new Error('Invalid start date format');
    if (endDateStr && !endDate) throw new Error('Invalid end date format');

    const dateRange = startDate && endDate ? { startDate, endDate } : undefined;
    return this.reportsService.getProfitLossReport(dateRange);
  }

  @Get('cow-production')
  @ApiQuery({
    name: 'cowId',
    required: false,
    type: String,
    description: 'Specific cow ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiOperation({ summary: 'Get cow production report with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Cow production report retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  async getCowProductionReport(
    @Query('cowId') cowId?: string,
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    const startDate = this.parseDate(startDateStr);
    const endDate = this.parseDate(endDateStr);

    if (startDateStr && !startDate)
      throw new Error('Invalid start date format');
    if (endDateStr && !endDate) throw new Error('Invalid end date format');

    const dateRange = startDate && endDate ? { startDate, endDate } : undefined;
    return this.reportsService.getCowProductionReport(cowId, dateRange);
  }

  @Get('customers')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiOperation({
    summary: 'Get customer analysis report with optional date range',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer report retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  async getCustomerReport(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    const startDate = this.parseDate(startDateStr);
    const endDate = this.parseDate(endDateStr);

    if (startDateStr && !startDate)
      throw new Error('Invalid start date format');
    if (endDateStr && !endDate) throw new Error('Invalid end date format');

    const dateRange = startDate && endDate ? { startDate, endDate } : undefined;
    return this.reportsService.getCustomerReport(dateRange);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard summary with key metrics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary retrieved successfully',
  })
  async getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get system health and statistics' })
  @ApiResponse({
    status: 200,
    description: 'System health report retrieved successfully',
  })
  async getHealthReport() {
    const [totalCows, totalCustomers, totalSales, totalExpenses] =
      await Promise.all([
        this.reportsService['cowModel'].countDocuments(),
        this.reportsService['customerModel'].countDocuments(),
        this.reportsService['saleModel'].countDocuments(),
        this.reportsService['expenseModel'].countDocuments(),
      ]);

    return {
      totalCows,
      totalCustomers,
      totalSales,
      totalExpenses,
      timestamp: new Date(),
    };
  }
}
