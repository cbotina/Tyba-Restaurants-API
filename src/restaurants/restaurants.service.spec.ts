import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RestaurantsService } from './restaurants.service';
import { SearchOptionsDto } from './dto/search-options.dto';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { googlePlacesConfig } from '../../config/google-places-api/google-places-api.config';

// Mockear la configuracion de googlePlaces
jest.mock('../../config/google-places-api/google-places-api.config', () => ({
  googlePlacesConfig: jest.fn(),
}));

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        // Mock de HttpService
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        // Mock de configService
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);

    // Mock de configuraciones de googlePlaces
    (googlePlacesConfig as jest.Mock).mockReturnValue({
      apiKey: 'mock-api-key',
      apiUrl: 'https://mock-url.com',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNearByRestaurants', () => {
    it('should return nearby restaurants', (done) => {
      const searchOptionsDto: SearchOptionsDto = {
        maxResultCount: 10,
        coordinates: { latitude: 0, longitude: 0 },
        radius: 1000,
      };

      const mockResponse = {
        places: [
          {
            id: '1',
            displayName: { text: 'Restaurant 1' },
            formattedAddress: '123 Test St',
            location: { latitude: 0, longitude: 0 },
          },
        ],
      };

      // Simular response de Google Places API
      jest.spyOn(httpService, 'post').mockReturnValue(
        of({
          data: mockResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse),
      );

      // Verifico que se ha realizado una peticion de tipo POST
      // con el body indicdo y los headers correspondientes
      service.getNearByRestaurants(searchOptionsDto).subscribe({
        next: (result) => {
          expect(result).toEqual(mockResponse);
          expect(httpService.post).toHaveBeenCalledWith(
            'https://mock-url.com:searchNearby',
            {
              includedTypes: ['restaurant'],
              maxResultCount: 10,
              locationRestriction: {
                circle: {
                  center: { latitude: 0, longitude: 0 },
                  radius: 1000,
                },
              },
            },
            {
              headers: {
                'X-Goog-Api-Key': 'mock-api-key',
                'X-Goog-FieldMask':
                  'places.displayName,places.formattedAddress,places.location,places.id',
              },
            },
          );
          expect(googlePlacesConfig).toHaveBeenCalledWith(configService);
          done();
        },
        error: done,
      });
    });

    it('should handle errors', (done) => {
      const searchOptionsDto: SearchOptionsDto = {
        maxResultCount: 10,
        coordinates: { latitude: 0, longitude: 0 },
        radius: 1000,
      };

      const mockError = new Error('API Error');

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => mockError));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Simulo un error al realizar la peticion
      service.getNearByRestaurants(searchOptionsDto).subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (error) => {
          expect(error).toBe(mockError);
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching nearby restaurants',
            mockError,
          );
          expect(googlePlacesConfig).toHaveBeenCalledWith(configService);
          done();
        },
      });
    });
  });
});
