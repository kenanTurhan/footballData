import { Controller, Get, Param } from '@nestjs/common';
import fetch from 'node-fetch';
import { JoueurEntity } from './joueur.entity';
import { JoueurService } from './joueur.service';
@Controller('api/joueurs')
export class JoueurController {
constructor(private readonly joueurService: JoueurService) {}
//recuperer joueurs par leur nom pour barre de recherche
  @Get('search/:joueur')
  async getJoueurs(@Param('joueur') joueur: string) {
    const response = await fetch(
      `https://v3.football.api-sports.io/players/profiles?search=${joueur}`,
      {
        headers: {
          'x-apisports-key': process.env.FOOTBALL_API_KEY || '',
        },
      },
    );
    if (!response.ok) {
      throw new Error('Erreur API externe');
    }

    return await response.json();
  }

//recuperer profil du joueur par son nom
  @Get('profile/:id')
  async getJoueurProfile(@Param('id') id: string) {
    const response = await fetch(
      `https://v3.football.api-sports.io/players?id=${id}&season=2023`,
      {
        headers: {
          'x-apisports-key': process.env.FOOTBALL_API_KEY || '',
        },
      },
    );
    if (!response.ok) {
      throw new Error('Erreur API externe');
    }

    return await response.json();

  }
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.joueurService.findById(Number(id));
  }
  @Get('test/:id/')
  async getJoueurEtCoéquipiers(@Param('id') id: number) {
    const joueur = await this.joueurService.findById(id);

  const match = await this.joueurService.findStatsById(id);

  return {
    joueur,
    match,
  };
}



}
