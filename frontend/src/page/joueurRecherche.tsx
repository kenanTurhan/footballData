// src/pages/SearchPlayerPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchPlayer } from "../hooks/useJoueurSearch";
import "../css/chercheJoueur.css";

export default function SearchPlayerPage() {
  const [query, setQuery] = useState("");
  const { players, loading, search } = useSearchPlayer();
  const navigate = useNavigate();

  const onSearch = () => search(query);

  return (
    <div className="page-joueur">
      <h1>Recherche de joueurs</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Nom du joueur..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={onSearch}>Rechercher</button>
      </div>

      {loading && <p>Chargement…</p>}




      <div className="results">
        {players.map((p: any, i) => (
          <div
            key={i}
            className="player-card"
            onClick={() => navigate(`/joueur/${p.player.id}`)}
          >
            <img src={p.player.photo} alt={p.player.name} />
            <h3>{p.player.name || "pas dans la BDD"}</h3>
            <p>{p.player.nationality || "pas dans la BDD"}</p>
            <p>{p.player.position || "pas dans la BDD"}</p>
            <p>{p.player.age || "pas dans la BDD"} ans</p>
            <p>{p.player.team || "pas dans la BDD"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
