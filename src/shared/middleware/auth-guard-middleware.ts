import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { MyLogger } from '../interface/my-logger';
import { GqlExecutionContext } from '@nestjs/graphql';
// import { GqlExecutionContext } from '@nestjs/graphql';

/***
 * This class is called everytime you mentions with UseGuard class
 * in Controller, Resolver and anywhere, we can have JWT verification
 * here.
 */
@Injectable()
export class AuthGuardMiddleware implements CanActivate, MyLogger {

  log(...msg) {
    Logger.log(msg.join(', '), this.constructor.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.log('Got the call');
    /**
     * Request object will be null in case of Graphql call,
     * so we have to handle that gracefully and attach the data,
     * in context of grapqhl request
     */
    const request = context.switchToHttp().getRequest();
    if (request) {
      /**
       * 1. This will be executed only for REST calls
       * 2. This will be available in req object,
       * in Controller in case of REST calls
       */
      request.user = { username: 'NEST_JS' };
      return true;
    } else {
      /**
       * 1. This will be executed only for Graphql calls
       * 2. This will be available in context object,
       * in resolvers in case of Graphql calls
       */
      this.log('Have to add the user in ctx');
      const ctx: any = GqlExecutionContext.create(context).getContext();
      ctx.user = { username: 'NEST_JS' };
      return true;
    }
  }
}
