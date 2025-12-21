// src/pages/JoueurPage.tsx
import { useParams } from "react-router-dom";
import { usePlayerProfile } from "../hooks/useJoueurPage";
import { RadarChart, Radar, PolarAngleAxis, PolarRadiusAxis, Legend, PolarGrid, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import "../css/accueil.css"; // Design moderne de la page d'accueil
import "../css/joueur.css"; // Styles spécifiques pour les joueurs

export default function JoueurPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();

  const { player, loading } = usePlayerProfile(numericId);

  if (loading) {
    return (
      <div className="home-wrapper">
        <div className="home-background-grid"></div>
        <div className="loading-section">
          <div className="loader-container">
            <div className="spinner"></div>
            <span className="loading-text">CHARGEMENT DU PROFIL...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="home-wrapper">
        <div className="home-background-grid"></div>
        <div className="empty-state">
          <div className="empty-message">
            <h3>Joueur introuvable</h3>
            <p>Le profil demandé n'existe pas</p>
          </div>
        </div>
      </div>
    );
  }

  // Assurez-vous que les données sont structurées comme prévu
  const info = player.player;
  const stats = player.statistics?.[0];

  // Préparation des données pour le Radar Chart
  const radarData = stats ? [
    { subject: "Tirs", A: stats.shots.total || 0, fullMark: 100 },
    { subject: "Buts", A: stats.goals.total || 0, fullMark: 100 },
    { subject: "Passes décisives", A: stats.goals.assists || 0, fullMark: 100 },
    { subject: "Passes clés", A: stats.passes.key || 0, fullMark: 100 },
    { subject: "Dribbles réussis", A: stats.dribbles.success || 0, fullMark: 100 },
    { subject: "Duels gagnés", A: stats.duels.won || 0, fullMark: 100 },
  ] : [];

  // Déterminer la valeur max pour la PolarRadiusAxis
  const maxRadarValue = radarData.reduce((max, item) => Math.max(max, item.A), 0) * 1.2;
  const domainMax = Math.max(100, Math.ceil(maxRadarValue / 10) * 10);

  return (
    <div className="home-wrapper">
      <div className="home-background-grid"></div>
      
      {/* Header avec informations du joueur */}
      <div className="home-header player-header">
        <div className="home-subtitle">PROFIL JOUEUR</div>
        <h1 className="home-title">{info.name}</h1>
        <div className="home-divider"></div>
        <p className="home-description">
          {info.nationality} • {info.age} ans • {info.injured ? 'Blessé' : 'En forme'}
        </p>
      </div>

      <div className="home-content">
        {/* Photo et infos principales */}
        <div className="player-profile-section">
          <div className="player-image-card">
            <img src={info.photo} alt={info.name} className="player-main-photo" />
          </div>
          
          <div className="player-info-cards">
            <div className="home-card player-info-card">
              <div className="home-card-inner">
                <div className="home-card-category">INFOS GÉNÉRALES</div>
                <div className="player-basic-info">
                  <div className="info-row">
                    <span className="info-label">Taille</span>
                    <span className="info-value">{info.height || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Poids</span>
                    <span className="info-value">{info.weight || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Nationalité</span>
                    <span className="info-value">{info.nationality}</span>
                  </div>
                </div>
              </div>
            </div>

            {stats && (
              <div className="home-card player-info-card">
                <div className="home-card-inner">
                  <div className="home-card-category">SAISON ACTUELLE</div>
                  <div className="player-basic-info">
                    <div className="info-row">
                      <span className="info-label">Club</span>
                      <span className="info-value">{stats.team.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Position</span>
                      <span className="info-value">{stats.games.position}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Matchs joués</span>
                      <span className="info-value">{stats.games.appearences || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques principales */}
        {stats && (
          <div className="stats-ribbon">
            <div className="ribbon-title">
              <h2>Statistiques Clés</h2>
              <div className="ribbon-divider"></div>
            </div>
            <div className="home-ribbon-grid stats-grid">
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">BUTS</div>
                  <div className="stat-number">{stats.goals.total || 0}</div>
                  <div className="stat-label">Cette saison</div>
                </div>
              </div>
              
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">PASSES DÉCISIVES</div>
                  <div className="stat-number">{stats.goals.assists || 0}</div>
                  <div className="stat-label">Cette saison</div>
                </div>
              </div>
              
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">TIRS</div>
                  <div className="stat-number">{stats.shots.total || 0}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
              
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">PASSES CLÉS</div>
                  <div className="stat-number">{stats.passes.key || 0}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Radar Chart */}
        {radarData.length > 0 && (
          <div className="radar-section">
            <div className="ribbon-title">
              <h2>Analyse des Performances</h2>
              <div className="ribbon-divider"></div>
            </div>
            
            <div className="radar-container">
              <div className="radar-chart-card">
                <ResponsiveContainer width="100%" height={450}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="subject" stroke="#333" fontSize={12} />
                    <PolarRadiusAxis angle={30} domain={[0, domainMax]} tickCount={6} stroke="#aaa" />
                    <Radar
                      name={info.name}
                      dataKey="A"
                      stroke="#000000"
                      fill="#000000"
                      fillOpacity={0.1}
                      isAnimationActive={true}
                      strokeWidth={2}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="radar-actions">
                <button onClick={() => navigate("/radar")} className="home-cta radar-button">
                  COMPARER À UN AUTRE JOUEUR →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}