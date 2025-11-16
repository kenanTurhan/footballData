import express, { Request, Response } from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors()); // autoriser les requêtes depuis ton front (localhost:5173)

const API_KEY = "TA_CLE_API"; // <-- mets ta clé API ici
const API_HOST = "v3.football.api-sports.io";

app.get("/api/teams/:leagueId", async (req: Request, res: Response) => {
  const { leagueId } = req.params;

  try {
    const response = await fetch(
      `https://${API_HOST}/teams?league=${leagueId}&season=2021`,
      {
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": API_HOST,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erreur fetch teams:", error);
    res.status(500).json({ error: "Erreur de récupération des équipes" });
  }
});

app.get("/api/club/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const response = await fetch(`https://${API_HOST}/teams?id=${id}`, {
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erreur fetch club:", error);
    res.status(500).json({ error: "Erreur de récupération du club" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
