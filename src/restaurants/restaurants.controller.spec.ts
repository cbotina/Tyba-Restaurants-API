import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { HistoryService } from '../../src/history/history.service';
import { SearchOptionsDto } from './search-options.dto';
import { of } from 'rxjs';
import { IRestaurant } from './interfaces/restaurant.interface';
import { firstValueFrom } from 'rxjs';
import { HistoryLogInterceptor } from '../history/interceptors/logging.interceptor';
import { RestaurantsInterceptor } from './interceptors/resaurants.interceptor';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let restaurantsService: RestaurantsService;
  let historyService: HistoryService;
  let restaurantsInterceptor: RestaurantsInterceptor;
  let historyLogInterceptor: HistoryLogInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: {
            getNearByRestaurants: jest.fn(),
          },
        },
        {
          provide: HistoryService,
          useValue: {
            createLog: jest.fn().mockResolvedValue(undefined),
          },
        },
        RestaurantsInterceptor,
        {
          provide: HistoryLogInterceptor,
          useFactory: (historyService: HistoryService) =>
            new HistoryLogInterceptor(historyService),
          inject: [HistoryService],
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    restaurantsService = module.get<RestaurantsService>(RestaurantsService);
    historyService = module.get<HistoryService>(HistoryService);
    restaurantsInterceptor = module.get<RestaurantsInterceptor>(
      RestaurantsInterceptor,
    );
    historyLogInterceptor = module.get<HistoryLogInterceptor>(
      HistoryLogInterceptor,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNearbyRestaurants', () => {
    it('should return nearby restaurants', async () => {
      const searchOptionsDto: SearchOptionsDto = {
        maxResultCount: 10,
        coordinates: { latitude: 0, longitude: 0 },
        radius: 100,
      };

      const mockRestaurants = {
        places: [
          {
            id: '1',
            displayName: { text: 'Restaurant 1' },
            formattedAddress: '123 Test St',
            location: { latitude: 0, longitude: 0 },
          },
        ],
      };

      const expectedResult: IRestaurant[] = [
        {
          id: '1',
          name: 'Restaurant 1',
          address: '123 Test St',
          location: { latitude: 0, longitude: 0 },
        },
      ];

      jest
        .spyOn(restaurantsService, 'getNearByRestaurants')
        .mockReturnValue(of(mockRestaurants));

      // Mock the execution context
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            method: 'GET',
            url: '/restaurants',
            headers: {},
            body: searchOptionsDto,
            user: { id: 'testuser' },
          }),
        }),
      } as any;

      // Apply interceptors manually
      const historyInterceptorHandler = await historyLogInterceptor.intercept(
        mockExecutionContext,
        {
          handle: () => controller.getNearbyRestaurants(searchOptionsDto),
        },
      );

      const restaurantsInterceptorHandler =
        await restaurantsInterceptor.intercept(mockExecutionContext, {
          handle: () => historyInterceptorHandler,
        });

      const result = await firstValueFrom(restaurantsInterceptorHandler);

      expect(result).toEqual(expectedResult);
      expect(restaurantsService.getNearByRestaurants).toHaveBeenCalledWith(
        searchOptionsDto,
      );
      expect(historyService.createLog).toHaveBeenCalled();
    });
  });
});
