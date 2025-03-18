import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { BoardLike } from '../../entities';

@Injectable()
export class BoardLikeRepository extends Repository<BoardLike> {
  constructor(manager: EntityManager) {
    super(BoardLike, manager);
  }
}
