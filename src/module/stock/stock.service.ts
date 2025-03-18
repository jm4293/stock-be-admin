import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { ResConfig } from '../../config';

@Injectable()
export class StockService {
  constructor() {}

  uploadFile(file: Express.Multer.File) {
    console.log('Uploaded file:', file);

    if (!this.isValidXLSXFile(file)) {
      throw ResConfig.Fail_400({ message: 'XLSX 파일이 아닙니다.' });
    }

    const ret = this.readXLSXFile(file);

    console.log('Parsed data:', ret);
  }

  private isValidXLSXFile(file: Express.Multer.File): boolean {
    return file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  private readXLSXFile(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    const firstSheetName = workbook.Sheets['유가증권'];

    const worksheet = firstSheetName['A2'];

    return worksheet ? worksheet.v : null;
  }
}
