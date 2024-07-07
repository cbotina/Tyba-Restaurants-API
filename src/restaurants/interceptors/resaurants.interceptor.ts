import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IRestaurant } from '../interfaces/restaurant.interface';
import { Coordinates } from '../dto/search-options.dto';

/**
 * Interceptor para mapear la response de Google Places a una lista de IRestaurant
 */
@Injectable()
export class RestaurantsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IRestaurant[]> {
    return next.handle().pipe(
      map((result: any) => {
        if (result.places) {
          return result.places.map(
            (doc: any): IRestaurant => ({
              id: doc.id,
              name: doc.displayName.text,
              address: doc.formattedAddress,
              location: doc.location as Coordinates,
            }),
          );
        } else {
          // Retornar lista vacia si la API retorna {} (Sin propiedad "places")
          return [];
        }
      }),
    );
  }
}
