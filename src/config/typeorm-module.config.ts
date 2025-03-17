import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeormModuleConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
  }),
  inject: [ConfigService],
};

// Docker mysql 연결 오류
// 1. SELECT Host, User, plugin, authentication_string FROM mysql.user WHERE User = 'root';
// 2. ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '6274';
