// src/pages/SearchPlayerPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchPlayer } from "../hooks/useJoueurSearch";
import { useMeilleur } from "../hooks/useMeilleur";
import "../css/accueil.css"; // Pour les styles de base (wrapper, header, cartes)
import "../css/chercheJoueur.css"; // Pour les styles spécifiques de recherche

export default function SearchPlayerPage() {
  const [query, setQuery] = useState("");
  const { players, loading, search } = useSearchPlayer();
  const { players: bestPlayers, loading: loadingBest, error, fetchMeilleurs } = useMeilleur();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeilleurs();
  }, []);

  const onSearch = () => search(query);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="home-wrapper">
      <div className="home-background-grid"></div>
      
      <div className="home-header">
        <div className="home-subtitle">RECHERCHE AVANCÉE</div>
        <h1 className="home-title">Joueurs</h1>
        <div className="home-divider"></div>
        <p className="home-description">
          Recherchez et découvrez les profils détaillés des joueurs de football
        </p>
      </div>

      <div className="home-content">
        {/* Barre de recherche */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Entrez le nom du joueur..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
              <button onClick={onSearch} className="search-button" disabled={loading}>
                {loading ? "RECHERCHE..." : "RECHERCHER"}
              </button>
            </div>
          </div>
        </div>

        {/* Top 10 meilleurs joueurs */}
        {loadingBest && (
          <div className="best-player">
            <h2>Chargement des meilleurs joueurs...</h2>
          </div>
        )}

        {!loadingBest && bestPlayers.length > 0 && players.length === 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Vous pouvez consulter...</h2>
              <div className="results-count">{bestPlayers.length} joueur(s)</div>
            </div>
            <div className="home-ribbon-grid">
              {bestPlayers.map((p: any, i) => (
                <div
                  key={i}
                  className="home-card ribbon-card player-result-card"
                  onClick={() => navigate(`/joueur/${p.player.id}`)}
                >
                  <div className="home-card-inner">
                    <div className="home-card-category"> {i + 1}</div>
                    
                    <div className="home-image-box ribbon-image">
                      <img
                        src={p.player.photo || '/placeholder-player.png'}
                        alt={p.player.name}
                        className="home-feature-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-player.png';
                        }}
                      />
                      <div className="home-image-overlay"></div>
                    </div>
                    
                    <div className="home-card-info">
                      <h4 className="home-feature-title">{p.player.name || "Nom non disponible"}</h4>
                      <p className="home-feature-subtitle">
                        {p.player.position || "Position inconnue"} • {p.player.age || "N/A"} ans
                      </p>
                      <p className="home-feature-description">
                        {p.player.nationality || "Nationalité inconnue"}
                        {p.player.team && ` • ${p.player.team}`}
                      </p>
                    </div>
                    
                    <div className="home-cta">
                      VOIR PROFIL →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {!loading && players.length == 0 && !loadingBest && bestPlayers.length === 0 && (
          <div className="empty-state">
            <div className="empty-message">
              <h3>Commencez votre recherche</h3>
              <p>Entrez le nom d'un joueur pour voir ses informations</p>
            </div>
          </div>
        )}

        {/* État de chargement recherche */}
        {loading && (
          <div className="best-player">
            <h2>Recherche en cours...</h2>
          </div>
        )}

        {/* Résultats */}
        {!loading && players.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Résultats de recherche</h2>
              <div className="results-count">{players.length} joueur(s) trouvé(s)</div>
            </div>
            <div className="home-ribbon-grid">
              {players.map((p: any, i) => (
                <div
                  key={i}
                  className="home-card ribbon-card player-result-card"
                  onClick={() => navigate(`/joueur/${p.player.id}`)}
                >
                  <div className="home-card-inner">
                    <div className="home-card-category">PROFIL</div>
                    
                    <div className="home-image-box ribbon-image">
                      <img
                        src={p.player.photo || '/placeholder-player.png'}
                        alt={p.player.name}
                        className="home-feature-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-player.png';
                        }}
                      />
                      <div className="home-image-overlay"></div>
                    </div>
                    
                    <div className="home-card-info">
                      <h4 className="home-feature-title">{p.player.name || "Nom non disponible"}</h4>
                      <p className="home-feature-subtitle">
                        {p.player.position || "Position inconnue"} • {p.player.age || "N/A"} ans
                      </p>
                      <p className="home-feature-description">
                        {p.player.nationality || "Nationalité inconnue"}
                        {p.player.team && ` • ${p.player.team}`}
                      </p>
                    </div>
                    
                    <div className="home-cta">
                      VOIR PROFIL →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && players.length === 0 && query && (
          <div className="empty-state">
            <div className="empty-message">
              <h3>Aucun résultat trouvé</h3>
              <p>Essayez avec un autre nom de joueur</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
