// src/pages/JoueurPage.tsx
import { useParams } from "react-router-dom";
import { usePlayerProfile } from "../hooks/useJoueurPage";
import { RadarChart, Radar, PolarAngleAxis, PolarRadiusAxis, Legend, PolarGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import "../css/accueil.css"; // Design moderne de la page d'accueil
import "../css/joueur.css"; // Styles spécifiques pour les joueurs
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

export default function JoueurPage() {
  console.log("📄 PlayerPage component loaded");
  
  const { id } = useParams();
  console.log("🆔 URL param id:", id);
  
  const numericId = Number(id);
  console.log("🔢 numericId:", numericId);
  
  const navigate = useNavigate();

  const { player, loading, error } = usePlayerProfile(numericId);

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

  if (error || !player) {
    return (
      <div className="home-wrapper">
        <div className="home-background-grid"></div>
        <div className="empty-state">
          <div className="empty-message">
            <h3>Joueur introuvable</h3>
            <p>{error || "Le profil demandé n'existe pas"}</p>
            <button onClick={() => navigate(-1)} className="home-cta">
              ← RETOUR
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Assurez-vous que les données sont structurées comme prévu
  const info = player.existingPlayer || player.existingPlayer2;
  const stats = player.statistics?.[0];
  const line = player.stat10;

  // Vérification de sécurité supplémentaire
  if (!info) {
    return (
      <div className="home-wrapper">
        <div className="home-background-grid"></div>
        <div className="empty-state">
          <div className="empty-message">
            <h3>Données du joueur incomplètes</h3>
            <p>Les informations du joueur ne sont pas disponibles</p>
            <button onClick={() => navigate(-1)} className="home-cta">
              ← RETOUR
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Préparation des données pour le Radar Chart
  const radarData = info ? [
    { subject: "Tirs", A: info.shoot || 0, fullMark: 100 },
    { subject: "Buts", A: info.goals || 0, fullMark: 100 },
    { subject: "Passes décisives", A: info.assists || 0, fullMark: 100 },
    { subject: "Passes clés", A: info.keyPasses || 0, fullMark: 100 },
    { subject: "Dribbles réussis", A: info.dribblesSuccess || 0, fullMark: 100 },
    { subject: "Duels gagnés", A: info.duelsWon || 0, fullMark: 100 },
  ] : [];
  console.log("📊 Radar Data:", radarData);
  
  const lineData = line ? line.map((line: any, index: number) => ({
    name: `M${index + 1}`, // Affiche M1, M2, M3... en bas
    But: line.goals || 0, // La valeur à afficher en courbe
    PasseDecisive: line.assists || 0, // La deuxième valeur à afficher en courbe
  })) : [];
  console.log("📊 Line Data:", lineData);

  // Déterminer la valeur max pour la PolarRadiusAxis
  const maxRadarValue = radarData.reduce((max, item) => Math.max(max, item.A), 0) * 1.2;
  const domainMax = Math.max(100, Math.ceil(maxRadarValue / 10) * 10);

  return (
    <div className="home-wrapper">
      <div className="home-background-grid"></div>
      
      {/* Header avec informations du joueur */}
      <div className="home-header player-header">
        <div className="home-subtitle">PROFIL JOUEUR</div>
        <h1 className="home-title">{info?.name || "Joueur inconnu"}</h1>
        <div className="home-divider"></div>
        <p className="home-description">
          {info?.nationality || "Nationalité inconnue"} • {info?.age || "Age inconnu"} ans • {info?.injured ? 'Blessé' : 'En forme'}
        </p>
      </div>

      <div className="home-content">
        {/* Photo et infos principales */}
        <div className="player-profile-section">
          <div className="player-image-card">
            <img src={info?.photo || '/default-player.jpg'} alt={info?.name || "Joueur"} className="player-main-photo" />
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

            {info && (
              <div className="home-card player-info-card">
                <div className="home-card-inner">
                  <div className="home-card-category">SAISON ACTUELLE</div>
                  <div className="player-basic-info">
                    <div className="info-row">
                      <span className="info-label">Club</span>
                      <span className="info-value">{info.team}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Position</span>
                      <span className="info-value">{info.position}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Matchs joués</span>
                      <span className="info-value">{info.appearances || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques principales */}
        {info && (
          <div className="stats-ribbon">
            <div className="ribbon-title">
              <h2>Statistiques Clés</h2>
              <div className="ribbon-divider"></div>
            </div>
            <div className="home-ribbon-grid stats-grid">
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">BUTS</div>
                  <div className="stat-number">{info.goals || 0}</div>
                  <div className="stat-label">Cette saison</div>
                </div>
              </div>
              
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">PASSES DÉCISIVES</div>
                  <div className="stat-number">{info.assists || 0}</div>
                  <div className="stat-label">Cette saison</div>
                </div>
              </div>
              
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">TIRS</div>
                  <div className="stat-number">{info.shoot || 0}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
              
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">PASSES CLÉS</div>
                  <div className="stat-number">{info.keyPasses || 0}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Analyse des Performances */}
        <div className="performance-analysis">
          <div className="ribbon-title">
            <h2>Analyse des Performances</h2>
            <div className="ribbon-divider"></div>
          </div>

          {info && (
            <>
              <div className="containerStat">
                <div className="radar">
                    <div className="radar-container">
                      <div className="radar-chart-card">
                        <div className="chart-title">
                          <h3>Radar des Performances</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={400}>
                          <RadarChart data={radarData}>
                            <PolarGrid stroke="#e0e0e0" />
                            <PolarAngleAxis dataKey="subject" stroke="#333" fontSize={11} />
                            <PolarRadiusAxis
                              angle={30}
                              domain={[0, domainMax]}
                              tickCount={6}
                              stroke="#aaa"
                            />
                            <Radar
                              name={info?.name || "Joueur"}
                              dataKey="A"
                              stroke="#000000"
                              fill="#000000"
                              fillOpacity={0.1}
                              strokeWidth={2}
                            />
                            <Legend wrapperStyle={{ paddingTop: "15px" }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                <div className="radar-actions">
                <button
                  onClick={() => navigate("/radar")}
                  className="home-cta radar-button"
                >
                  COMPARER À UN AUTRE JOUEUR →
                </button>
              </div>

                </div>

                <div className="Courbe">
                  <div className="radar-container">
                  <div className="radar-chart-card">
                    <div className="chart-title">
                      <h3>Forme (10 derniers matchs)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={lineData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#888" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            stroke="#888" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                            width={30}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="But" 
                            stroke="#007acc" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#007acc", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 6 }}
                        />
                                                <Line 
                            type="monotone" 
                            dataKey="PasseDecisive" 
                            stroke="#cc4400ff" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#cc4400ff", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 6 }}
                        />

                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>                
                <div className="radar-actions">
                <button
                  onClick={() => navigate("/courbes")}
                  className="home-cta radar-button"
                >
                  COMPARER À UN AUTRE JOUEUR →
                </button>
              </div>

                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}