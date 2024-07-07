import { Body, Controller, Get, UseInterceptors } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { SearchOptionsDto } from './dto/search-options.dto';
import { RestaurantsInterceptor } from './interceptors/resaurants.interceptor';
import { HistoryLogInterceptor } from '../../src/history/interceptors/logging.interceptor';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @UseInterceptors(HistoryLogInterceptor)
  @UseInterceptors(RestaurantsInterceptor)
  @Get()
  getNearbyRestaurants(@Body() searchOptionsDto: SearchOptionsDto) {
    return this.restaurantsService.getNearByRestaurants(searchOptionsDto);
  }
}
