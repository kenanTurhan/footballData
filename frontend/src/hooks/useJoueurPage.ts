// src/hooks/usePlayerProfile.ts
import { useState, useEffect } from "react";
import { getPlayerProfile } from "../service/joueurStatService";

export function usePlayerProfile(id: number) {
  console.log("🎯 Hook usePlayerProfile appelé avec ID:", id);
  
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔄 useEffect déclenché avec ID:", id);
    
    if (!id) {
      console.log("❌ Pas d'ID fourni, arrêt");
      return;
    }

    (async () => {
      try {
        console.log("🚀 Début appel getPlayerProfile...");
        const data = await getPlayerProfile(id);
        console.log("Réponse backend pour le joueur", id, ":", data); // <-- debug

        // Vérifier si la réponse est une erreur
        if (data && data.error) {
          setError(data.message || "Erreur lors du chargement du joueur");
          setPlayer(null);
        } else {
          setPlayer(data);
          setError(null);
        }
      } catch (err) {
        console.error("Erreur profil joueur :", err);
        setError("Erreur lors du chargement du joueur");
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  console.log("🏁 Hook retourne:", { player, loading, error });
  return { player, loading, error };
}
