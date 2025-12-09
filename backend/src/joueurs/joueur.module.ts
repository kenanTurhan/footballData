import { Module } from '@nestjs/common';
import { JoueurController } from './joueur.controlleur';

@Module({
  controllers: [JoueurController],
})
export class JoueurModule {}
