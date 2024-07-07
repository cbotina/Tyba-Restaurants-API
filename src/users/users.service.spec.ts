import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User, Roles } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { plainToInstance } from 'class-transformer';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            findOneByOrFail: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAdminUser', () => {
    it('should call findOneBy with admin role', async () => {
      await service.findAdminUser();
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        role: Roles.ADMIN,
      });
    });
  });

  describe('createAdminUser', () => {
    it('should not create admin if one already exists', async () => {
      jest.spyOn(service, 'findAdminUser').mockResolvedValue({} as User);
      await service.createAdminUser();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should create admin user if none exists', async () => {
      jest.spyOn(service, 'findAdminUser').mockResolvedValue(null);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        const config = {
          'admin.password': 'password',
          'admin.email': 'admin@example.com',
          'admin.firstName': 'Admin',
          'admin.lastName': 'User',
        };
        return config[key];
      });
      jest.spyOn(service, 'create').mockResolvedValue({} as User);

      await service.createAdminUser();

      expect(service.create).toHaveBeenCalledWith({
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        password: 'password',
      });
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password',
      };

      const createdUser = {
        ...registerDto,
        id: '1',
        role: Roles.CUSTOMER,
      };

      jest.spyOn(userRepository, 'create').mockReturnValue(createdUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(createdUser);

      const result = await service.create(registerDto);

      expect(userRepository.create).toHaveBeenCalledWith(registerDto);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual(plainToInstance(User, createdUser));
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user = { email, id: '1' } as User;

      jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue(user);

      const result = await service.findOneByEmail(email);

      expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const id = '1';
      const user = { id, email: 'test@example.com' } as User;

      jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue(user);

      const result = await service.findOne(id);

      expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ id });
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', email: 'user1@example.com' },
        { id: '2', email: 'user2@example.com' },
      ] as User[];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
});
