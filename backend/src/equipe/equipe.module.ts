import { Module } from '@nestjs/common';
import { FootballController } from './equipe.controlleur';

@Module({
  controllers: [FootballController],
})
export class FootballModule {}
