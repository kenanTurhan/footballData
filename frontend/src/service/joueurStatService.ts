// src/service/joueurProfileService.ts
export async function getPlayerProfile(id: number) {
  console.log("🔍 Appel API pour le joueur ID:", id);
  
  const res = await fetch(`/api/joueurs/profile/${id}`);
  console.log("📡 Réponse fetch status:", res.status);

  if (!res.ok) {
    const errorData = await res.json();
    console.error("❌ Erreur API:", errorData);
    throw new Error(errorData.message || "Erreur API backend");
  }

  const data = await res.json();
  console.log("📄 Data brute reçue:", data);
  
  // Le backend retourne soit {stat10, existingPlayer} soit {stat10, existingPlayer2}
  // ou bien une erreur {error: true, message: "..."}
  if (data.error) {
    console.error("❌ Erreur dans la réponse:", data);
    throw new Error(data.message);
  }
  
  const result = data;
  console.log("✅ Résultat final:", result);
  
  return result;
}
