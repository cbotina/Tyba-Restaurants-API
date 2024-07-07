import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/users/entities/user.entity';

export const ROLES_KEY = 'roles';
// Decorador que establece los roles permitidos para un endpoint
export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
