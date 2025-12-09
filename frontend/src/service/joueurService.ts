// src/services/player.service.ts

export async function searchPlayers(query: string) {
  if (!query.trim()) return [];

  const res = await fetch(`http://localhost:3000/api/joueurs/search/${query}`);
  if (!res.ok) throw new Error("Failed to fetch players");

  const data = await res.json();
  return data.response || [];
}
