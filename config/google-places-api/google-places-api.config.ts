import { ConfigService } from '@nestjs/config';

export const googlePlacesConfig = (
  configService: ConfigService,
): PlacesApiOptions => {
  return {
    apiKey: configService.get('googlePlaces.apiKey'),
    apiUrl: configService.get('googlePlaces.apiUrl'),
  };
};

export interface PlacesApiOptions {
  apiKey: string;
  apiUrl: string;
}
