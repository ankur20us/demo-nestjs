import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { User } from './user.dto';
import { MyLogger } from 'src/shared/interface/my-logger';

@Injectable()
export class UsersService implements MyLogger {

  private users: User[] = [];

  constructor() {
    this.log('User Service Object created');
  }

  log(...msg) {
    Logger.log(msg.join(', '), this.constructor.name);
  }

  addUser(name: string, age: number): User {
    this.log(`addUser ${age} ${name}`);
    const id = uuid();
    const user = new User(id, name, age);

    this.users.push(user);
    return user;
  }

  getUser(userId: string): User {
    this.log(`getUser ${userId}`);
    const { user } = this._findUser(userId);
    if (user) { return { ...user }; }

    /**
     * This throw is being cought by http-error interceptor,
     * and is being returned from there, which
     */
    throw new NotFoundException('Id not exists');
  }

  getUsers(): User[] {
    this.log(`getUsers`);
    return [...this.users];
  }

  deleteUser(userId: string): User {
    this.log(`deleteUser ${userId}`);
    const { index, user } = this._findUser(userId);
    if (user) {
      const userCopy = { ...user };
      this.users.splice(index, 1);
      return userCopy;
    }

    /**
     * This throw is being cought by http-error interceptor,
     * and is being returned from there
     */
    throw new NotFoundException('Id not exists');
  }

  private _findUser(userId): { index: number, user: User } {
    const index = this.users.findIndex(({ id }) => id === userId);
    const user = index < 0 ? null : this.users[index];

    return ({
      index,
      user,
    });
  }
}
