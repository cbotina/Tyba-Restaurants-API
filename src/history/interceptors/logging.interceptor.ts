import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HistoryService } from '../history.service';
import { Log } from '../schemas/log.schema';

@Injectable()
export class HistoryLogInterceptor implements NestInterceptor {
  constructor(private readonly historyService: HistoryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

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
      timestamp: new Date(),
    };

    this.historyService.createLog(log).catch((error) => {
      console.error('Error saving log to MongoDB', error);
    });

    console.log(
      `INCOMING REQUEST:\n\tMethod - ${method}\n\tURL - ${url}\n\tOrigin - ${origin}\n\tBody - ${body}`,
    );

    return next.handle().pipe(
      tap(() => {
        console.log(`\tHandled in ${Date.now() - now}ms`);
      }),
    );
  }
}
