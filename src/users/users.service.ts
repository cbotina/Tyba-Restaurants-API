import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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
}
