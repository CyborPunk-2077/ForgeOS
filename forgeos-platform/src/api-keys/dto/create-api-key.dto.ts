import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  expiresInDays?: number;
}
