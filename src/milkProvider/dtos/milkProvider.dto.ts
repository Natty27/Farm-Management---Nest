// create-milk-provider.dto.ts
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateMilkProviderDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  contact_person?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  quality_rating?: number;
}
