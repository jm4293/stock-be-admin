import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { ResConfig } from '../../config';
import { StockUploadDto } from '../../type/dto/stock';
import { KOSDAQCodeRepository, KOSPICodeRepository } from '../../database/response';
import { KOSDAQCode, KOSPICode } from '../../database/entities';

@Injectable()
export class StockService {
  constructor(
    private readonly kospiCodeRepository: KOSPICodeRepository,
    private readonly kosdaqCodeRepository: KOSDAQCodeRepository,
  ) {}

  async uploadFile(params: { file: Express.Multer.File }) {
    const { file } = params;

    if (!this.isValidXLSXFile(file)) {
      throw ResConfig.Fail_400({ message: 'XLSX 파일이 아닙니다.' });
    }

    const ret = this.parseXLSXFile(file);

    ret.shift();

    await this.saveStockCodes({ arr: ret });
  }

  private isValidXLSXFile(file: Express.Multer.File): boolean {
    return file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  private parseXLSXFile(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = '유가증권';
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw ResConfig.Fail_400({ message: '유가증권 시트가 없습니다.' });
    }

    const ref = worksheet['!ref'];

    if (!ref) {
      throw ResConfig.Fail_400({ message: '시트에 데이터가 없습니다.' });
    }

    const range = XLSX.utils.decode_range(ref);

    const { s: start, e: end } = range;

    const rowCount = end.r - start.r + 1;
    const colCount = end.c - start.c + 1;

    return Array.from({ length: rowCount }, (_, i) => {
      return Array.from({ length: colCount }, (_, j) => {
        const cellRef = XLSX.utils.encode_cell({ r: start.r + i, c: start.c + j });
        const cell = worksheet[cellRef];

        return cell ? cell.v : null;
      });
    });
  }

  private async saveStockCodes(params: { arr: any[] }) {
    const { arr } = params;

    const entities = arr.map((row) => {
      const entity = new KOSPICode();

      entity.name = row[0] as string;
      entity.code = row[1] as number;
      entity.marketType = row[2] as string;
      entity.stockType = row[3] as string;

      return entity;
    });

    await this.kospiCodeRepository.save(entities);
  }
}
