import { Module } from '@nestjs/common';
import { Constants } from './constants';

@Module({
  exports: [Constants],
})
export class ConstantModule {}
