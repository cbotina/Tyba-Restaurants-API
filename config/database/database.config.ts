import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

export const dbConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.database'),
    entities: [User],
    synchronize: configService.get('database.synchronize'),
  };
};
