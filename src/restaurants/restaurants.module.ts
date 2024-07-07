import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { HttpModule } from '@nestjs/axios';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [HttpModule, HistoryModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
