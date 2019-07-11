
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyLogger } from '../interface/my-logger';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>>, MyLogger {

  log(...msg) {
    Logger.log(msg.join(', '), this.constructor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const { method } = context.switchToHttp().getRequest();
    this.log('Got the call in transform interceptor', method);
    return next.handle().pipe(map(data => ({ data })));
  }
}
