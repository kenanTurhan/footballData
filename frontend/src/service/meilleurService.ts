// src/services/player.service.ts

export async function meilleur() {
  const res = await fetch(`/api/joueurs/meilleur`);
  if (!res.ok) throw new Error("Failed to fetch players");

  const data = await res.json();
  console.log("Data reçue du backend:", data);
  return data || [];
}
