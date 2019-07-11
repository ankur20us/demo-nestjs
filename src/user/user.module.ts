import { Module } from '@nestjs/common';

import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserResolver],
})
export class UsersModule {}
