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
exports.JoueurController = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
let JoueurController = class JoueurController {
    async getJoueurs(joueur) {
        const response = await (0, node_fetch_1.default)(`https://v3.football.api-sports.io/players/profiles?search=${joueur}`, {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_API_KEY || '',
            },
        });
        if (!response.ok) {
            throw new Error('Erreur API externe');
        }
        return await response.json();
    }
    async getJoueurProfile(id) {
        const response = await (0, node_fetch_1.default)(`https://v3.football.api-sports.io/players?id=${id}&season=2023`, {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_API_KEY || '',
            },
        });
        if (!response.ok) {
            throw new Error('Erreur API externe');
        }
        return await response.json();
    }
};
exports.JoueurController = JoueurController;
__decorate([
    (0, common_1.Get)('search/:joueur'),
    __param(0, (0, common_1.Param)('joueur')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JoueurController.prototype, "getJoueurs", null);
__decorate([
    (0, common_1.Get)('profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JoueurController.prototype, "getJoueurProfile", null);
exports.JoueurController = JoueurController = __decorate([
    (0, common_1.Controller)('api/joueurs')
], JoueurController);
//# sourceMappingURL=joueur.controlleur.js.map