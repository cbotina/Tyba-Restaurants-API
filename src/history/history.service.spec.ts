import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from './history.service';
import { getModelToken } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';

describe('HistoryService', () => {
  let service: HistoryService;
  let model: Model<LogDocument>;

  const mockLog: Log = {
    method: 'GET',
    url: '/test',
    userId: 'user123',
    origin: 'http://localhost:3000',
    body: { key: 'value' },
    timestamp: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        // Mock de MongooseModule.forFeature ...
        {
          provide: getModelToken(Log.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockLog),
            constructor: jest.fn().mockResolvedValue(mockLog),
            find: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
    model = module.get<Model<LogDocument>>(getModelToken(Log.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllLogs', () => {
    it('should return all logs', async () => {
      const mockLogs = [mockLog];

      // Simulo comportamiento de metodo find en el modelo
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockLogs),
        }),
      } as any);

      const result = await service.getAllLogs();

      // Verifico que los resultados coincidan
      expect(result).toEqual(mockLogs);

      // Verifico que el metodo del modelo ha sido llamado
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('getLogsByUser', () => {
    it('should return logs for a specific user', async () => {
      const userId = 'user123';

      const mockLogs = [mockLog];

      // Mock de MongooseLogs (implementando toObject)
      const mockMongooseLogs = mockLogs.map((log) => ({
        ...log,
        toObject: jest.fn().mockReturnValue(log),
      }));

      // Simulo metodo find en el modelo, retornando los MongooseLogs
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockMongooseLogs),
        }),
      } as any);

      // Llamo al metodo del servicio con el userId
      const result = await service.getLogsByUser(userId);

      // Verifico que los resultados coincidan
      expect(result).toEqual(mockLogs.map((log) => plainToClass(Log, log)));

      // Verifico que el metodo find del modelo sea llamado con el userId proporcionado
      expect(model.find).toHaveBeenCalledWith({ userId });
    });
  });
});
