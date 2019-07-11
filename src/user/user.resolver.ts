import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Context } from '@nestjs/graphql';

import { User } from './user.dto';
import { UsersService } from './user.service';
import { MyLogger } from 'src/shared/interface/my-logger';
import { AuthGuardMiddleware } from 'src/shared/middleware/auth-guard-middleware';

@Resolver()
export class UserResolver implements MyLogger {
  constructor(private userService: UsersService) { }

  log(...msg: any) {
    Logger.log(msg.join(', '), this.constructor.name);
  }

  @Query()
  @UseGuards(new AuthGuardMiddleware())
  users(@Context('user') user: string): User[] {
    this.log(JSON.stringify(user));
    return this.userService.getUsers();
  }

  @Query()
  @UseGuards(new AuthGuardMiddleware())
  user(@Args('userId')userId: string): User {
    return this.userService.getUser(userId);
  }
}
