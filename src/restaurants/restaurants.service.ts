import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { googlePlacesConfig } from 'config/google-places-api/google-places-api.config';
import { catchError, map } from 'rxjs';
import { SearchOptionsDto } from './search-options.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getNearByRestaurants(searchOptionsDto: SearchOptionsDto) {
    const { apiKey, apiUrl } = googlePlacesConfig(this.configService);
    const { maxResultCount, coordinates, radius } = searchOptionsDto;

    const url = `${apiUrl}:searchNearby`;

    const headers = {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.displayName,places.formattedAddress,places.location,places.id',
    };

    const body = {
      includedTypes: ['restaurant'],
      maxResultCount,
      locationRestriction: {
        circle: {
          center: {
            ...coordinates,
          },
          radius,
        },
      },
    };

    return this.httpService.post(url, body, { headers }).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error fetching nearby restaurants', error);
        throw error;
      }),
    );
  }
}
