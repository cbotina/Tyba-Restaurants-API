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

  findAdminUser() {
    return this.usersRepository.findOneBy({ role: Roles.ADMIN });
  }

  async createAdminUser() {
    const existingAdmin = await this.findAdminUser();

    if (existingAdmin != null) {
      return;
    }

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
    return plainToInstance(User, createdUser);
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneByOrFail({ email });
  }

  findOne(id: string) {
    return this.usersRepository.findOneByOrFail({ id });
  }

  findAll() {
    return this.usersRepository
      .find()
      .then((users) => users.map((u) => plainToInstance(User, u)));
  }
}
