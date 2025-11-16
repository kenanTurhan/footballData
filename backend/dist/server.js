"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_fetch_1 = require("node-fetch");
const cors_1 = require("cors");
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
const API_KEY = "TA_CLE_API";
const API_HOST = "v3.football.api-sports.io";
app.get("/api/teams/:leagueId", async (req, res) => {
    const { leagueId } = req.params;
    try {
        const response = await (0, node_fetch_1.default)(`https://${API_HOST}/teams?league=${leagueId}&season=2021`, {
            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": API_HOST,
            },
        });
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error("Erreur fetch teams:", error);
        res.status(500).json({ error: "Erreur de récupération des équipes" });
    }
});
app.get("/api/club/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await (0, node_fetch_1.default)(`https://${API_HOST}/teams?id=${id}`, {
            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": API_HOST,
            },
        });
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error("Erreur fetch club:", error);
        res.status(500).json({ error: "Erreur de récupération du club" });
    }
});
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map