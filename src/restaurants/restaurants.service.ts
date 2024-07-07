import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { googlePlacesConfig } from '../../config/google-places-api/google-places-api.config';
import { catchError, map } from 'rxjs';
import { SearchOptionsDto } from './dto/search-options.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Metodo que retorna una lista de restaurantes cercanos segun
   * opciones de busqueda.
   * @param searchOptionsDto Opciones de busqueda (coordenadas y radio)
   * @returns Response de Google Places API. Posteriormente se mapea dicha
   * respuesta en el interceptor  RestaurantsInterceptor
   */
  getNearByRestaurants(searchOptionsDto: SearchOptionsDto) {
    const { apiKey, apiUrl } = googlePlacesConfig(this.configService);
    const { maxResultCount, coordinates, radius } = searchOptionsDto;

    const url = `${apiUrl}:searchNearby`;

    // Headers requeridos pos la API.
    // FieldMask define los datos que se consultaran de cada restaurante
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
