// src/service/joueurProfileService.ts
export async function getPlayerProfile(id: number) {
  const res = await fetch(`/api/joueurs/profile/${id}`);

  if (!res.ok) throw new Error("Erreur API backend");

  const data = await res.json();
  return data.response?.[0] || null;
}
