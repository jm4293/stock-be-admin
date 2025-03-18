import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { KOSPICode } from '../../entities';

@Injectable()
export class KOSPICodeRepository extends Repository<KOSPICode> {
  constructor(manager: EntityManager) {
    super(KOSPICode, manager);
  }
}
