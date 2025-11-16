import { Controller, Get, Param } from '@nestjs/common';
import fetch from 'node-fetch';

@Controller('api/teams')
export class FootballController {
  // Route pour récupérer toutes les équipes d'une ligue
  @Get('league/:leagueId')
  async getTeams(@Param('leagueId') leagueId: string) {
    const response = await fetch(
      `https://v3.football.api-sports.io/teams?league=${leagueId}&season=2021`,
      {
        headers: {
          'x-rapidapi-key': process.env.FOOTBALL_API_KEY ?? '',
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      },
    );
    if (!response.ok) {
      throw new Error('Erreur API externe');
    }

    return await response.json();
  }

  // Route pour récupérer un club par son ID
  @Get(':id')
  async getTeam(@Param('id') id: string) {
    const response = await fetch(
      `https://v3.football.api-sports.io/teams?id=${id}`,
      {
        headers: {
          'x-rapidapi-key': process.env.FOOTBALL_API_KEY ?? '',
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Erreur API externe');
    }

    return await response.json();
  }

    // Route pour récupérer les stat de club par id
@Get('stat/:leagueId/:teamId')
async getTeamStat(
  @Param('leagueId') leagueId: string,
  @Param('teamId') teamId: string,
) {
  const response = await fetch(
    `https://v3.football.api-sports.io/teams/statistics?league=${leagueId}&team=${teamId}&season=2021`,
    {
      headers: {
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY ?? '',
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Erreur API externe');
  }

  return await response.json();
}


}
