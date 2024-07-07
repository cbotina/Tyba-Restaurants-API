import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Role(Roles.ADMIN)
  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }
}
