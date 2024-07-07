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
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockLogs),
        }),
      } as any);

      const result = await service.getAllLogs();
      expect(result).toEqual(mockLogs);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('getLogsByUser', () => {
    it('should return logs for a specific user', async () => {
      const userId = 'user123';
      const mockLogs = [mockLog];
      const mockMongooseLogs = mockLogs.map((log) => ({
        ...log,
        toObject: jest.fn().mockReturnValue(log),
      }));

      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockMongooseLogs),
        }),
      } as any);

      const result = await service.getLogsByUser(userId);
      expect(result).toEqual(mockLogs.map((log) => plainToClass(Log, log)));
      expect(model.find).toHaveBeenCalledWith({ userId });
    });
  });
});
