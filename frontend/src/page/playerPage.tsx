// src/pages/JoueurPage.tsx
import { useParams } from "react-router-dom";
import { usePlayerProfile } from "../hooks/useJoueurPage";
import { RadarChart, Radar, PolarAngleAxis, PolarRadiusAxis, Legend, PolarGrid, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import "../css/joueur.css";

export default function JoueurPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();

  const { player, loading } = usePlayerProfile(numericId);

  if (loading) return <p>Chargement...</p>;
  if (!player) return <p>Aucun joueur trouvé</p>;

  // Assurez-vous que les données sont structurées comme prévu
  const info = player.player;
  const stats = player.statistics?.[0];

  // Préparation des données pour le Radar Chart
  const radarData = stats ? [
    { subject: "Tir", A: stats.shots.total || 0, fullMark: 100 },
    { subject: "But", A: stats.goals.total || 0, fullMark: 100 },
    { subject: "Passe décisive", A: stats.goals.assists || 0, fullMark: 100 },
    { subject: "Passe clé", A: stats.passes.key || 0, fullMark: 100 },
    { subject: "Dribble réussi", A: stats.dribbles.success || 0, fullMark: 100 },
    { subject: "Duel gagné", A: stats.duels.won || 0, fullMark: 100 },
  ] : [];

  // Déterminer la valeur max pour la PolarRadiusAxis si les fullMark sont dynamiques, sinon utiliser 100
  const maxRadarValue = radarData.reduce((max, item) => Math.max(max, item.A), 0) * 1.2;
  const domainMax = Math.max(100, Math.ceil(maxRadarValue / 10) * 10); // S'assurer que le max est au moins 100 et un multiple de 10

  return (
    <div className="player-container">
      
      {/* 1. Profil et Informations de Base (Header stylisé) */}
      <div className="player-profile-header">
        <img src={info.photo} alt={info.name} className="player-photo" />
        <div className="profile-details">
          <h1>{info.name}</h1>
          <p>Nationalité : {info.nationality}</p>
          <p>Âge : {info.age} ans</p>
          <p> {info.injured ? 'Blessé ' : 'En forme'}</p>
        </div>
      </div>

      {stats && (
        <>
          {/* 2. Statistiques Clés (Buts et Passes) */}
          <div className="key-stats">
            <div className="stat-card">
              <h3>Buts</h3>
              <p>{stats.goals.total || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Passes Décisives</h3>
              <p>{stats.goals.assists || 0}</p>
            </div>
          </div>
          
          {/* 3. Informations Détaillées (Grille) */}
          <h2 style={{ color: '#1e3c72', marginBottom: '20px' }}>Détails du Joueur</h2>
          <div className="info-grid">
              <div className="info-item"><strong>Club</strong><span>{stats.team.name}</span></div>
              <div className="info-item"><strong>Poste</strong><span>{stats.games.position}</span></div>
              <div className="info-item"><strong>Matchs Joués</strong><span>{stats.games.appearences || 0}</span></div>
              <div className="info-item"><strong>Taille</strong><span>{info.height}</span></div>
              <div className="info-item"><strong>Poids</strong><span>{info.weight}</span></div>
              <div className="info-item"><strong>Saison</strong><span>{stats.league.season}</span></div>
          </div>
        </>
      )}
      
      {/* 4. Radar Chart de Statistiques Générales */}
      <div className="radar-section">
        <h2>Statistiques Générales</h2>
        
        <div className="chart-container" style={{ maxWidth: 500 }}>
          {/* Utiliser ResponsiveContainer pour s'assurer que le graphique s'adapte correctement */}
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart
              data={radarData}
            >
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="subject" stroke="#333" fontSize={12} />
              {/* Le domaine est ajusté dynamiquement pour mieux utiliser l'espace */}
              <PolarRadiusAxis angle={30} domain={[0, domainMax]} tickCount={6} stroke="#aaa" /> 
              <Radar
                name={info.name}
                dataKey="A"
                stroke="#ff6f61" /* Couleur d'action pour le contour */
                fill="#ff6f61"
                fillOpacity={0.7}
                isAnimationActive={true}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <button onClick={() => navigate("/radar")} className="compare-button">
          Comparer à un autre joueur
        </button>
      </div>

    </div>
  );
}