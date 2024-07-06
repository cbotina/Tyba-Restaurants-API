import { Body, Controller, Get, UseInterceptors } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { SearchOptionsDto } from './search-options.dto';
import { RestaurantsInterceptor } from './interceptors/resaurants.interceptor';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @UseInterceptors(RestaurantsInterceptor)
  @Get()
  getNearbyRestaurants(@Body() searchOptionsDto: SearchOptionsDto) {
    return this.restaurantsService.getNearByRestaurants(searchOptionsDto);
  }
}
