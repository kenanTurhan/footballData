import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FootballModule } from './equipe/equipe.module';
import { ConfigModule } from '@nestjs/config';
import { JoueurModule } from './joueurs/joueur.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoueurEntity } from './joueurs/joueur.entity';
import { MatchStatsEntity } from './joueurs/stats.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'db', // le service Docker
      port: +process.env.DATABASE_PORT! || 5432,
      username: process.env.DATABASE_USER || 'myuser',
      password: process.env.DATABASE_PASSWORD || 'mypass',
      database: process.env.DATABASE_NAME || 'mydb',
      entities: [JoueurEntity, MatchStatsEntity],
      synchronize: false, // Désactivé pour éviter les conflits avec les données existantes
    }),
    FootballModule,
    JoueurModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
