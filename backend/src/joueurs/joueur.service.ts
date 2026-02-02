import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoueurEntity } from './joueur.entity';
import { MatchStatsEntity } from './stats.entity';
import { JoueurApiEntity } from './joueurApi.entity';
import { IsNull, Not } from 'typeorm';
@Injectable()
export class JoueurService {
  constructor(
    @InjectRepository(JoueurEntity)
    private readonly joueurRepo: Repository<JoueurEntity>,

    @InjectRepository(JoueurApiEntity)
    private readonly joueurApiRepo: Repository<JoueurApiEntity>,

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

  findStatsByIdSQL(nom: string) {
  return this.statsRepo.query(
    'SELECT * FROM joueur WHERE nom_prenom LIKE $1',
    [`%${nom}%`],
  );

}

  isIdBdd(id: number) {
    return this.joueurRepo.findOneBy({ id: id });
  }

async savePlayerFromApi(apiData: any) {
  console.log("=== DEBUT SAVE PLAYER FROM API ===");
  console.log("Structure complète des données reçues:", JSON.stringify(apiData, null, 2));
  
  if (!apiData || !apiData.response) {
    console.error("❌ Erreur: apiData ou apiData.response est undefined");
    console.log("apiData:", apiData);
    throw new Error("Format de données API invalide: response manquant");
  }
  
  if (!Array.isArray(apiData.response)) {
    console.error("❌ Erreur: apiData.response n'est pas un tableau");
    console.log("apiData.response:", apiData.response);
    throw new Error("Format de données API invalide: response n'est pas un tableau");
  }
  
  if (apiData.response.length === 0) {
    console.warn("⚠️ Aucun joueur trouvé dans l'API pour cet ID");
    console.log("Paramètres de la requête:", apiData.parameters);
    console.log("Nombre de résultats:", apiData.results);
    throw new Error(`Joueur non trouvé dans l'API pour l'ID ${apiData.parameters?.id}`);
  }

  const p = apiData.response[0];
  console.log("Premier élément de response:", JSON.stringify(p, null, 2));
  
  if (!p.player) {
    console.error("❌ Erreur: p.player est undefined");
    console.log("Structure de p:", Object.keys(p));
    throw new Error("Format de données API invalide: player manquant");
  }
  
  console.log("Données API reçues pour le joueur :", p);
const player = this.joueurApiRepo.create({
  id: p.player.id,
  apiPlayerId: p.player.id,
  name: p.player.name,
  age: p.player.age,
  nationality: p.player.nationality,
  team: p.statistics[0].team.name,
  position: p.statistics[0].games.position,
  injured: p.player.injured,
  photo: p.player.photo,
  height: p.player.height,
  weight: p.player.weight,
  appearances: p.statistics[0].games.appearences, // ✅
  goals: p.statistics[0].goals.total,
  assists: p.statistics[0].goals.assists,
  shoot: p.statistics[0].shots.total,              // ✅
  keyPasses: p.statistics[0].passes.key,
  dribblesSuccess: p.statistics[0].dribbles.success,
  duelsWon: p.statistics[0].duels.won,
});

  return this.joueurApiRepo.save(player);
}
async findPlayerByApiId(apiPlayerId: number) {
  return this.joueurApiRepo.findOneBy({ apiPlayerId });
}

find10ByApiId(idApi: number) {
  return this.statsRepo.findBy({ idApi });
}

findTop10Players(){
  return this.joueurApiRepo.find({
  where: {
    goals: Not(IsNull()),
  },
  order: {
    goals: 'DESC',
  },
  take: 10,
});
}

}
