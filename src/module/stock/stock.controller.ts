import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StockService } from './stock.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.stockService.uploadFile({ file });
  }
}
