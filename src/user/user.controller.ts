import { Controller, Post, Body, Get, Param, Delete, Logger, UseGuards, UseInterceptors } from '@nestjs/common';

import { UsersService } from './user.service';
import { User } from './user.dto';
import { AuthGuardMiddleware } from 'src/shared/middleware/auth-guard-middleware';
import { TransformInterceptor } from 'src/shared/middleware/transform.interceptor';
import { UserDecorator } from './user.decorator';

@Controller('users')

/**
 * Before returning the response this interceptor comes in to picture and transforms the response,
 * in the format mentioned
 */
@UseInterceptors(new TransformInterceptor())
export class UsersController {

  constructor( private readonly userService: UsersService ) { }

  log(...msg) {
    Logger.log(msg.join(', '), this.constructor.name);
  }

  @Post()
  adduser(@Body('age') age: number, @Body('name') name: string): User {
    this.log(`addUser ${age} ${name}`);
    return this.userService.addUser(name, age);
  }

  /**
   * This uses AuthGuardMiddleware means the call first goes to AuthGuardMiddleware class
   * that class checks for the Authentication or so, and then we can get the user object in context
   * which we use with UserDecorator
   */
  @Get()
  @UseGuards(AuthGuardMiddleware)
  getUsers(@UserDecorator('username') username: string): User[] {
    this.log(`getUsers`, username);
    return this.userService.getUsers();
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string): User {
    this.log(`getUser ${userId}`);
    return this.userService.getUser(userId);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: string): User {
    this.log(`deleteUser ${userId}`);
    return this.userService.deleteUser(userId);
  }
}
