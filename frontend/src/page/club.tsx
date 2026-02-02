import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/accueil.css";
import "../css/joueur.css";
import "../css/club.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

type Team = {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
};

type Venue = {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
};

type TeamStats = {
  fixtures: {
    played: { total: number };
    wins: { total: number };
    draws: { total: number };
    loses: { total: number };
  };
  goals: {
    for: { total: { total: number } };
    against: { total: { total: number } };
  };
};

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ClubPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamAndStats = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const teamResponse = await fetch(`/api/teams/${id}`);
        if (!teamResponse.ok) throw new Error("Erreur API backend");
        const teamData = await teamResponse.json();

        if (teamData.results > 0) {
          setTeam(teamData.response[0].team);
          setVenue(teamData.response[0].venue);

          const leagueId = teamData.response[0].league?.id ?? 39;

          const statsResponse = await fetch(`/api/teams/stat/${leagueId}/${id}`);
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData.response) {
              setStats(statsData.response);
            }
          }
        } else {
          throw new Error("Club non trouvé");
        }
      } catch (error) {
        console.error("Erreur récupération du club/statistiques :", error);
        setError("Impossible de récupérer le club");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAndStats();
  }, [id]);

  if (loading) {
    return (
      <div className="home-wrapper">
        <div className="home-background-grid"></div>
        <div className="loading-section">
          <div className="loader-container">
            <div className="spinner"></div>
            <span className="loading-text">CHARGEMENT DU CLUB...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="home-wrapper">
        <div className="home-background-grid"></div>
        <div className="empty-state">
          <div className="empty-message">
            <h3>Club introuvable</h3>
            <p>{error || "Le club demandé n'existe pas"}</p>
            <button onClick={() => navigate(-1)} className="home-cta">
              ← RETOUR
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pieData = stats
    ? [
        { name: "Victoires", value: stats.fixtures.wins.total },
        { name: "Nuls", value: stats.fixtures.draws.total },
        { name: "Défaites", value: stats.fixtures.loses.total },
      ]
    : [];

  return (
    <div className="home-wrapper">
      <div className="home-background-grid"></div>

      <div className="home-header player-header">
        <div className="home-subtitle">PROFIL CLUB</div>
        <h1 className="home-title">{team.name}</h1>
        <div className="home-divider"></div>
        <p className="home-description">
          {team.country} • Fondé en {team.founded} • {team.national ? "Sélection nationale" : "Club professionnel"}
        </p>
      </div>

      <div className="home-content">
        <div className="player-profile-section club-profile-section">
          <div className="player-image-card">
            <img src={team.logo} alt={team.name} className="club-main-logo" />
          </div>

          <div className="player-info-cards">
            <div className="home-card player-info-card">
              <div className="home-card-inner">
                <div className="home-card-category">IDENTITÉ</div>
                <div className="player-basic-info">
                  <div className="info-row">
                    <span className="info-label">Pays</span>
                    <span className="info-value">{team.country}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Fondation</span>
                    <span className="info-value">{team.founded}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Code</span>
                    <span className="info-value">{team.code || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {venue && (
              <div className="home-card player-info-card">
                <div className="home-card-inner">
                  <div className="home-card-category">STADE</div>
                  <div className="player-basic-info">
                    <div className="info-row">
                      <span className="info-label">Nom</span>
                      <span className="info-value">{venue.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Ville</span>
                      <span className="info-value">{venue.city}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Capacité</span>
                      <span className="info-value">{venue.capacity.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {venue && (
          <div className="club-venue-section">
            <div className="home-card club-venue-card">
              <div className="home-card-inner">
                <div className="home-card-category">ENCEINTE</div>
                <div className="club-venue-body">
                  <img src={venue.image} alt={venue.name} className="club-venue-image" />
                  <div className="club-venue-info">
                    <div className="info-row">
                      <span className="info-label">Adresse</span>
                      <span className="info-value">{venue.address}, {venue.city}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Surface</span>
                      <span className="info-value">{venue.surface}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stats && (
          <div className="stats-ribbon">
            <div className="ribbon-title">
              <h2>Statistiques Clés</h2>
              <div className="ribbon-divider"></div>
            </div>
            <div className="home-ribbon-grid stats-grid">
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">MATCHS</div>
                  <div className="stat-number">{stats.fixtures.played.total}</div>
                  <div className="stat-label">Joués</div>
                </div>
              </div>
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">VICTOIRES</div>
                  <div className="stat-number">{stats.fixtures.wins.total}</div>
                  <div className="stat-label">Cette saison</div>
                </div>
              </div>
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">BUTS MARQUÉS</div>
                  <div className="stat-number">{stats.goals.for.total.total}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
              <div className="home-card ribbon-card stat-card">
                <div className="home-card-inner">
                  <div className="home-card-category">BUTS ENCAISSÉS</div>
                  <div className="stat-number">{stats.goals.against.total.total}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="performance-analysis">
          <div className="ribbon-title">
            <h2>Analyse des Résultats</h2>
            <div className="ribbon-divider"></div>
          </div>

          {stats ? (
            <div className="containerStat">
              <div className="radar">
                <div className="radar-container">
                  <div className="radar-chart-card">
                    <div className="chart-title">
                      <h3>Statistiques de Match</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        data={[
                          { name: "Matchs joués", value: stats.fixtures.played.total },
                          { name: "Victoires", value: stats.fixtures.wins.total },
                          { name: "Défaites", value: stats.fixtures.loses.total },
                          { name: "Matchs nuls", value: stats.fixtures.draws.total },
                          { name: "Buts marqués", value: stats.goals.for.total.total },
                          { name: "Buts encaissés", value: stats.goals.against.total.total },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} width={30} />
                        <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                        <Legend />
                        <Bar dataKey="value" fill="#000000" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="Courbe">
                <div className="radar-container">
                  <div className="radar-chart-card">
                    <div className="chart-title">
                      <h3>Victoires / Nuls / Défaites</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          fill="#8884d8"
                          label={(slice) => `${Math.round((slice.percent ?? 0) * 100)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-message">
                <h3>Aucune statistique disponible</h3>
                <p>Les statistiques du club ne sont pas encore disponibles.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
