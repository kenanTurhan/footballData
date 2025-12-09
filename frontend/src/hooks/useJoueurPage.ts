// src/hooks/usePlayerProfile.ts
import { useState, useEffect } from "react";
import { getPlayerProfile } from "../service/joueurStatService";

export function usePlayerProfile(id: number) {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await getPlayerProfile(id);
        setPlayer(data);
      } catch (err) {
        console.error("Erreur profil joueur :", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return { player, loading };
}
