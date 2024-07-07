import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { Log } from './schemas/log.schema';

describe('HistoryController', () => {
  let controller: HistoryController;
  let service: HistoryService;

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
      controllers: [HistoryController],
      providers: [
        {
          provide: HistoryService,
          useValue: {
            // Mock de funciones del servicio
            getAllLogs: jest.fn(),
            getLogsByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HistoryController>(HistoryController);
    service = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllLogs', () => {
    it('should return all logs', async () => {
      const mockLogs = [mockLog];

      // simulo que el servicio retorna la lista de mockLogs
      jest.spyOn(service, 'getAllLogs').mockResolvedValue(mockLogs);

      const result = await controller.getAllLogs();

      // Verifico que el resultado sea la lista de mockLogs
      expect(result).toBe(mockLogs);

      // Verifico que el controlador está llamando al servicio
      expect(service.getAllLogs).toHaveBeenCalled();
    });
  });

  describe('getLogsByUser', () => {
    it('should return logs for a specific user', async () => {
      const userId = 'user123';
      const mockLogs = [mockLog];

      // simulo que el servicio retorna el historial de usuario
      jest.spyOn(service, 'getLogsByUser').mockResolvedValue(mockLogs);

      const result = await controller.getLogsByUser(userId);

      // Verifico que el resultado sea la lista de logs
      expect(result).toBe(mockLogs);

      // Verifico que el metodo logsByUser es llamado utilizando el userId proporcionado
      expect(service.getLogsByUser).toHaveBeenCalledWith(userId);
    });
  });
});
