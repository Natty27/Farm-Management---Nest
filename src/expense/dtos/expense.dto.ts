import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// Define all possible expense categories
export enum ExpenseCategory {
  FEED = 'feed',
  MEDICAL = 'medical',
  LABOR = 'labor',
  MAINTENANCE = 'maintenance',
  OTHER = 'other',
}
// expense.enum.ts
export enum ExpenseType {
  // Feed Expenses
  CATTLE_FEED = 'cattle_feed',
  POULTRY_FEED = 'poultry_feed',
  HAY = 'hay',
  SUPPLEMENTS = 'supplements',
  MINERALS = 'minerals',

  // Medical Expenses
  VACCINATION = 'vaccination',
  VET_VISIT = 'vet_visit',
  MEDICINE = 'medicine',
  DEWORMING = 'deworming',
  SURGERY = 'surgery',

  // Labor Expenses
  WAGES = 'wages',
  CONTRACT_WORK = 'contract_work',
  OVERTIME = 'overtime',
  SEASONAL_WORKER = 'seasonal_worker',

  // Maintenance Expenses
  BARN_REPAIR = 'barn_repair',
  FENCE_REPAIR = 'fence_repair',
  EQUIPMENT_SERVICE = 'equipment_service',
  VEHICLE_MAINTENANCE = 'vehicle_maintenance',

  // Other Expenses
  TRANSPORTATION = 'transportation',
  UTILITIES = 'utilities',
  INSURANCE = 'insurance',
  MISCELLANEOUS = 'miscellaneous',
}
export class CreateExpenseDto {
  @IsEnum(ExpenseType)
  type: ExpenseType;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsNumber()
  amount: number;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  @IsOptional()
  description?: string;
}
