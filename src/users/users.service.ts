import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles, User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  findAdminUser(): Promise<User | null> {
    return this.usersRepository.findOneBy({ role: Roles.ADMIN });
  }

  async createAdminUser(): Promise<void> {
    const existingAdmin = await this.findAdminUser();

    // Si ya existe un admin, se retorna el admin
    if (existingAdmin != null) {
      return;
    }

    // Propiedades obtenidas de las variables de entorno
    const password = this.configService.get('admin.password');
    const email = this.configService.get('admin.email');
    const firstName = this.configService.get('admin.firstName');
    const lastName = this.configService.get('admin.lastName');

    const registerDto: RegisterDto = {
      email,
      firstName,
      lastName,
      password,
    };

    const createdUser = await this.create(registerDto);

    createdUser.role = Roles.ADMIN;

    await this.usersRepository.save(createdUser);
  }

  async create(registerDto: RegisterDto) {
    const { password } = registerDto;
    const hashedPassword = await hash(password, 10);

    const user = this.usersRepository.create(registerDto);
    user.password = hashedPassword;

    const createdUser = this.usersRepository.save(user);

    // Uso de class-transformer para omitir información sensible
    return plainToInstance(User, createdUser);
  }

  // Metodos find lanzan excepciones TypeORM en caso de no encontrar la entidad

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneByOrFail({ email });
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneByOrFail({ id });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository
      .find()
      .then((users) => users.map((u) => plainToInstance(User, u)));
  }
}
