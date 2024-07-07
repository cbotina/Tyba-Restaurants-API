import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { HistoryService } from '../history.service';
import { Log } from '../schemas/log.schema';

// Interceptor para capturar la informacion del request y
// almacenarlo en la base de datos de historial
@Injectable()
export class HistoryLogInterceptor implements NestInterceptor {
  constructor(private readonly historyService: HistoryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const origin =
      request.headers.origin || request.headers.referer || 'unknown origin';
    const body = request.body;
    const userId = request.user ? request.user.id : 'anonymous';

    const log: Log = {
      method,
      url,
      origin,
      body,
      userId,
      timestamp: new Date(Date.now()),
    };

    this.historyService.createLog(log).catch((error) => {
      console.error('Error saving log to MongoDB', error);
    });

    return next.handle();
  }
}
