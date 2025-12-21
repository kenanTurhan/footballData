import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [team, setTeam] = useState<Team | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeamAndStats = async () => {
      if (!id) return;
      setLoading(true);

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
        }
      } catch (error) {
        console.error("Erreur récupération du club/statistiques :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAndStats();
  }, [id]);

  if (loading) return <div className="loader">Chargement...</div>;
  if (!team) return <div className="loader">Club non trouvé</div>;

  const pieData = stats
    ? [
        { name: "Victoires", value: stats.fixtures.wins.total },
        { name: "Nuls", value: stats.fixtures.draws.total },
        { name: "Défaites", value: stats.fixtures.loses.total },
      ]
    : [];

  return (
    <div className="page">
      <div className="left-column">
        <div className="club-header">
          <img src={team.logo} alt={team.name} className="club-logo" />
          <div className="club-details">
            <h1>{team.name}</h1>
            <p><strong>Pays:</strong> {team.country}</p>
            <p><strong>Fondé:</strong> {team.founded}</p>
            <p><strong>Code:</strong> {team.code}</p>
            <p><strong>National:</strong> {team.national ? "Oui" : "Non"}</p>
          </div>
        </div>

        {venue && (
          <div className="venue-section">
            <h2>{venue.name}</h2>
            
            <img src={venue.image} alt={venue.name} className="venue-image" />
            <p><strong>Adresse:</strong> {venue.address}, {venue.city}</p>
            <p><strong>Capacité:</strong> {venue.capacity.toLocaleString()}</p>
            <p><strong>Surface:</strong> {venue.surface}</p>
          </div>
        )}
      </div>

      <div className="right-column">
        <h2>KPI / Statistiques</h2>

        {stats ? (
          <>
            {/* BarChart des stats */}
            <h3>Stats de match</h3>
            <div className="stats-chart" style={{ width: "100%", height: 300, marginBottom: "2rem" }}>
              <ResponsiveContainer>
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PieChart des résultats */}
            <h3>Répartition Victoires / Nuls / Défaites</h3>
            <div className="stats-chart" style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={(slice) => `${Math.round((slice.percent ?? 0) * 100)}%`} // affiche seulement %
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} /> {/* légende pour les noms */}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p>Aucune statistique disponible</p>
        )}
      </div>
    </div>
  );
}
