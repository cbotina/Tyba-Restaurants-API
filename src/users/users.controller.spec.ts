import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Roles } from './entities/user.entity';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest
        .fn()
        .mockResolvedValue([
          { id: 1, email: 'test@test.com', role: Roles.ADMIN },
        ]),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await usersController.getAllUsers();
      expect(result).toEqual([
        { id: 1, email: 'test@test.com', role: Roles.ADMIN },
      ]);
    });
  });
});
