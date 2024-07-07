import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { environments } from 'config/environments';
import configuration from 'config/conriguration';
import configValidation from 'config/validation/config-validation.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from 'config/database/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { HistoryModule } from './history/history.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from 'config/database/mongoose.config';

// Para cada modulo que requiera informacion sensible se
// hace uso de ConfigService para acceder a las variables de entorno
// y obtener la informacion del archivo .env correspondiente

// En los modulos que utilicen factories, se inyecta ConfigService
// para acceder a sus variables
@Module({
  imports: [
    ConfigModule.forRoot({
      // Se carga un archivo .env distinto dependiendo del
      // entorno seleccionado
      envFilePath: environments[process.env.NODE_ENV],
      load: [configuration],
      // Validacion del archivo .env
      validationSchema: configValidation,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbConfig,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongooseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
