import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoueurEntity } from './joueur.entity';
import { MatchStatsEntity } from './stats.entity';

@Injectable()
export class JoueurService {
  constructor(
    @InjectRepository(JoueurEntity)
    private readonly joueurRepo: Repository<JoueurEntity>,

    @InjectRepository(MatchStatsEntity)
    private readonly statsRepo: Repository<MatchStatsEntity>,
  ) {}

  findById(id: number) {
    return this.joueurRepo.find({
      where: { id: id },
    });
  }
  findStatsById(id: number) {
    return this.statsRepo.find({
      where: { player_id: id },
    });
  }

}
