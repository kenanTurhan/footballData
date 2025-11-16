"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballController = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
let FootballController = class FootballController {
    async getTeams(leagueId) {
        const response = await (0, node_fetch_1.default)(`https://v3.football.api-sports.io/teams?league=${leagueId}&season=2021`, {
            headers: {
                'x-rapidapi-key': process.env.FOOTBALL_API_KEY ?? '',
                'x-rapidapi-host': 'v3.football.api-sports.io',
            },
        });
        if (!response.ok) {
            throw new Error('Erreur API externe');
        }
        return await response.json();
    }
    async getTeam(id) {
        const response = await (0, node_fetch_1.default)(`https://v3.football.api-sports.io/teams?id=${id}`, {
            headers: {
                'x-rapidapi-key': process.env.FOOTBALL_API_KEY ?? '',
                'x-rapidapi-host': 'v3.football.api-sports.io',
            },
        });
        if (!response.ok) {
            throw new Error('Erreur API externe');
        }
        return await response.json();
    }
    async getTeamStat(leagueId, teamId) {
        const response = await (0, node_fetch_1.default)(`https://v3.football.api-sports.io/teams/statistics?league=${leagueId}&team=${teamId}&season=2021`, {
            headers: {
                'x-rapidapi-key': process.env.FOOTBALL_API_KEY ?? '',
                'x-rapidapi-host': 'v3.football.api-sports.io',
            },
        });
        if (!response.ok) {
            throw new Error('Erreur API externe');
        }
        return await response.json();
    }
};
exports.FootballController = FootballController;
__decorate([
    (0, common_1.Get)('league/:leagueId'),
    __param(0, (0, common_1.Param)('leagueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FootballController.prototype, "getTeams", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FootballController.prototype, "getTeam", null);
__decorate([
    (0, common_1.Get)('stat/:leagueId/:teamId'),
    __param(0, (0, common_1.Param)('leagueId')),
    __param(1, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FootballController.prototype, "getTeamStat", null);
exports.FootballController = FootballController = __decorate([
    (0, common_1.Controller)('api/teams')
], FootballController);
//# sourceMappingURL=equipe.controlleur.js.map