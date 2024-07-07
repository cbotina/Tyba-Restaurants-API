import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly usersService: UsersService) {}
  /**
   * Creación de usuario admin. Se ejecuta cada vez que se inicia la aplicación
   */
  async onApplicationBootstrap() {
    await this.usersService.createAdminUser();
  }
}
