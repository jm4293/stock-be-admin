import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { KOSDAQCodeRepository, KOSPICodeRepository } from '../../database/response';

@Module({
  imports: [],
  controllers: [StockController],
  providers: [StockService, KOSPICodeRepository, KOSDAQCodeRepository],
  exports: [],
})
export class StockModule {}
