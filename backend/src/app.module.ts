import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FootballModule } from './equipe/equipe.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), FootballModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
