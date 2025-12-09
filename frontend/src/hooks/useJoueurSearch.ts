// src/hooks/useSearchPlayer.ts
import { useState } from "react";
import { searchPlayers } from "../service/joueurService";

export function useSearchPlayer() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await searchPlayers(query);
      setPlayers(result);
    } catch (err) {
      console.error("Erreur recherche joueur :", err);
    } finally {
      setLoading(false);
    }
  };

  return { players, loading, search };
}
