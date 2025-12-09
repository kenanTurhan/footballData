import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FootballModule } from './equipe/equipe.module';
import { ConfigModule } from '@nestjs/config';
import { JoueurModule } from './joueurs/joueur.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FootballModule, JoueurModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
