import { SetMetadata } from '@nestjs/common';

// Decorador que permite el acceso publico a un endpoint
export const Public = () => SetMetadata('isPublic', true);
