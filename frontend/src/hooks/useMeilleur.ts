// src/hooks/useMeilleur.ts
import { useState, useEffect } from "react";
import { meilleur } from "../service/meilleurService";

export function useMeilleur() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeilleurs = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await meilleur();
      setPlayers(result);
    } catch (err) {
      console.error("Erreur lors de la récupération des meilleurs joueurs :", err);
      setError("Impossible de récupérer les meilleurs joueurs");
    } finally {
      setLoading(false);
    }
  };

  return { players, loading, error, fetchMeilleurs };
}
