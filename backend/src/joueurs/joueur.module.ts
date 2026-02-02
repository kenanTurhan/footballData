import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoueurEntity } from './joueur.entity';
import { JoueurService } from './joueur.service';
import { JoueurController } from './joueur.controlleur';
import { MatchStatsEntity } from './stats.entity';
import { JoueurApiEntity } from './joueurApi.entity';
@Module({
  imports: [TypeOrmModule.forFeature([JoueurEntity, MatchStatsEntity, JoueurApiEntity])],
  providers: [JoueurService],
  controllers: [JoueurController],
})
export class JoueurModule {}
