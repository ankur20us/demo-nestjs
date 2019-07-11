import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyLogger } from '../interface/my-logger';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor, MyLogger {

  log(...msg) {
    Logger.log(msg.join(', '), this.constructor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    if (req) {
      // This part is only for REST calls
      const { method, url } = req;
      this.log('i am having req context', method, url);
    } else {
      // This part is only for GRAPHQL calls
      const ctx: any = GqlExecutionContext.create(context);
      this.log('I am having graphql context');
      this.log('Before...');
    }
    return next
      .handle()
      .pipe(tap(() => this.log(`After... ${Date.now() - now}ms`)));
  }
}
