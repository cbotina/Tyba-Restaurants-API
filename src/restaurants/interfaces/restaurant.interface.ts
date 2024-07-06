import { Coordinates } from '../search-options.dto';

export interface IRestaurant {
  id: string;
  name: string;
  address: string;
  location: Coordinates;
}
