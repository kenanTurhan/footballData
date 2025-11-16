export declare class FootballController {
    getTeams(leagueId: string): Promise<unknown>;
    getTeam(id: string): Promise<unknown>;
    getTeamStat(leagueId: string, teamId: string): Promise<unknown>;
}
