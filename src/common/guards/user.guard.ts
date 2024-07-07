import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from '../../../src/users/entities/user.entity';
import { RequestWithUser } from '../interfaces/request_with_user';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const { user } = request;
    const { userId } = request.params;

    if (user.role === Roles.ADMIN) {
      return true;
    }

    return userId === user.id;
  }
}
