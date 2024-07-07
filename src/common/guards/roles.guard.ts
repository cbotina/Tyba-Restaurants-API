import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestWithUser } from '../interfaces/request_with_user';

// Guard que verifica si el rol de usuario en request es permitido en un endpoint especifico
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole: Roles = this.reflector.getAllAndOverride<Roles>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Revisar si se ha aplicado el decorador Public
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    // Permitir acceso para endpoints publicos
    if (isPublic) {
      return true;
    }

    // Si no se especifica un rol en el decorador, se permite el acceso
    if (!requiredRole) {
      return true;
    }
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const { user } = request;

    // Si no hay usuario en el request, denegar
    if (!user) {
      return false;
    }

    // Permitir acceso si el usuario es admin
    if (user.role == Roles.ADMIN) {
      return true;
    }

    // Permitir el acceso si el rol del usuario es
    // igual al rol requerido para el endpoint
    return requiredRole == user.role;
  }
}
