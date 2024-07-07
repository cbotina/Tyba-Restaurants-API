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
        // Mock de TypeORM.ForFeature([User])
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
        // Mock de ConfigService
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

      // Verifico que se llamo a la funcion del repositorio de usuarios
      // con rol de ADMIN
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        role: Roles.ADMIN,
      });
    });
  });

  describe('createAdminUser', () => {
    it('should not create admin if one already exists', async () => {
      // Simulo que existe un admin en la bd
      jest.spyOn(service, 'findAdminUser').mockResolvedValue({} as User);

      await service.createAdminUser();
      // Si el admin existe, no se debe llamar al repositorio
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should create admin user if none exists', async () => {
      // Simulo que no existe ningun admin en la bd
      jest.spyOn(service, 'findAdminUser').mockResolvedValue(null);

      // Mock de las variables de configuracion en ConfigService
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        const config = {
          'admin.password': 'password',
          'admin.email': 'admin@example.com',
          'admin.firstName': 'Admin',
          'admin.lastName': 'User',
        };
        return config[key];
      });

      // Mock de el metodo create del servicio
      jest.spyOn(service, 'create').mockResolvedValue({} as User);

      await service.createAdminUser();

      // Verifico que se llama al servicio con las variables
      // de ConfigService
      expect(service.create).toHaveBeenCalledWith({
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        password: 'password',
      });

      // Como el usuario no existe, se debe llamar al repositorio
      // y crear al usuario admin
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

      // Mock de funciones del repositorio
      jest.spyOn(userRepository, 'create').mockReturnValue(createdUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(createdUser);

      const result = await service.create(registerDto);

      // Verifico que el repositorio sea llamado con el dto correspondiente
      expect(userRepository.create).toHaveBeenCalledWith(registerDto);

      // Verifico que el repositorio sea llamado
      expect(userRepository.save).toHaveBeenCalled();

      // Verifico que el resultado sea el usuario (con los datos sensibles ocultos)
      expect(result).toEqual(plainToInstance(User, createdUser));
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user = { email, id: '1' } as User;

      // Mock de funcion findOneByOrFail
      jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue(user);

      const result = await service.findOneByEmail(email);

      expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ email });

      // Verifico que el resultado sea el usuario correcto
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const id = '1';
      const user = { id, email: 'test@example.com' } as User;

      jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue(user);

      const result = await service.findOne(id);

      // Verifico que la funcion de busqueda sea llamada con el id correcto
      expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ id });

      // Verifico que el resultado sea el usuario correcto
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

      // Verifico que la funcion de busqueda del repositorio sea llamada
      expect(userRepository.find).toHaveBeenCalled();

      // Verifico que el resultado sea una lista de usuarios correcta
      expect(result).toEqual(users);
    });
  });
});
