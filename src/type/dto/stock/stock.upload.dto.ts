import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class StockUploadDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  type: 'kospi' | 'kosdaq';
}
