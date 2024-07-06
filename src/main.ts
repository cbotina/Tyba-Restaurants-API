import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMExceptionFilter } from './common/filters/typeorm-exception.filter';
import { AxiosExceptionFilter } from './common/filters/axios-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new TypeORMExceptionFilter());
  app.useGlobalFilters(new AxiosExceptionFilter());

  await app.listen(port);
}
bootstrap();
