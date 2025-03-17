import { Injectable } from '@nestjs/common';
import { UserAccount } from '../../entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserAccountRepository extends Repository<UserAccount> {
  constructor(manager: EntityManager) {
    super(UserAccount, manager);
  }
}
