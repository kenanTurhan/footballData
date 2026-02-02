import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
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
  const idNum = parseInt(id, 10);

  // 🔍 Vérifie si le joueur existe déjà en base
  const existingPlayer = await this.joueurService.findPlayerByApiId(idNum);
  if (existingPlayer) {
    const stat10 = await this.joueurService.find10ByApiId(idNum);
    return { stat10, existingPlayer };
  }

  console.log(`Joueur ${idNum} non trouvé en base, appel API...`);

  // ⚡ Sinon appel API
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

  const data = await response.json();
  console.log(`Réponse API pour ID ${id}:`, JSON.stringify(data, null, 2));

  try {
    // 💾 Sauvegarde en base
    await this.joueurService.savePlayerFromApi(data);

    // 🔁 Retour au front
    const existingPlayer2 = await this.joueurService.findPlayerByApiId(idNum);
    if (existingPlayer2) {
      const stat10 = await this.joueurService.find10ByApiId(idNum);
      return { stat10, existingPlayer2 };
    } else {
      throw new Error(`Joueur ${idNum} non trouvé après sauvegarde`);
    }
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde du joueur ${id}:`, error.message);
    
    // Si le joueur n'existe pas dans l'API, retourner une erreur 404
    if (error.message.includes('Joueur non trouvé dans l\'API')) {
      throw new HttpException(
        {
          error: true,
          message: `Joueur avec l'ID ${id} non trouvé dans l'API Football`,
          statusCode: 404
        },
        HttpStatus.NOT_FOUND
      );
    }
    
    // Pour toute autre erreur, retourner une erreur 500
    throw new HttpException(
      {
        error: true,
        message: `Erreur lors de la récupération du profil du joueur: ${error.message}`,
        statusCode: 500
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}


  @Get('meilleur')
  async getMeilleursJoueurs() {
    const topPlayers = await this.joueurService.findTop10Players();
    
    // Format les données pour correspondre au format attendu par le frontend
    return topPlayers.map(player => ({
      player: {
        id: player.apiPlayerId,
        name: player.name,
        photo: player.photo,
        age: player.age,
        nationality: player.nationality,
        position: player.position,
        team: player.team,
      }
    }));
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
  
  @Get('sql/:nom')
  async getByName(@Param('nom') nom: string) {
    const nomString = await this.joueurService.findStatsByIdSQL(nom);
    return nomString;
  }

}




