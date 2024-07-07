import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IRestaurant } from '../interfaces/restaurant.interface';
import { Coordinates } from '../search-options.dto';

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
          return [];
        }
      }),
    );
  }
}
