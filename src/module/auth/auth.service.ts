import { Injectable } from '@nestjs/common';
import { UserAccountRepository } from '../../database/response';
import { LoginDto } from '../../type/dto/auth';
import { ResConfig } from '../../config';
import { UserTypeEnum } from '../../constant/enum';
import { BcryptHandler } from '../../handler';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async login(params: { dto: LoginDto; res: Response }) {
    const { dto, res } = params;
    const { email, password } = dto;

    await this.userAccountRepository.findUserAccountByEmail(email);

    const adminAccount = await this.userAccountRepository.findOne({
      where: { email, user: { type: UserTypeEnum.ADMIN } },
      relations: ['user'],
    });

    if (!adminAccount) {
      throw ResConfig.Fail_400({ message: 'ADMIN 계정이 아닙니다.' });
    }

    const isMatch = await BcryptHandler.comparePassword(password, adminAccount.password as string);

    if (!isMatch) {
      throw ResConfig.Fail_400({ message: '비밀번호가 일치하지 않습니다.' });
    }

    return res.status(200).json({ email });
  }
}
