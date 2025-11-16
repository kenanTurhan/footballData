import React, { useState, useEffect } from "react";
import type { CSSProperties, JSX } from "react";
import { useNavigate } from "react-router-dom";

type Team = {
  id: number;
  name: string;
};

export default function Wheel(): JSX.Element {
  const countries = ["France", "Espagne", "Angleterre", "Turkiye"];
  const [selectedIndex, setSelectedIndex] = useState<number>(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const selectedCountry = countries[selectedIndex];

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        let leagueId: number;
        switch (selectedCountry) {
          case "France":
            leagueId = 61;
            break;
          case "Espagne":
            leagueId = 140;
            break;
          case "Turkiye":
            leagueId = 204;
            break;

          case "Angleterre":
            leagueId = 39;
            break;
          default:
            leagueId = 204;
        }

        const response = await fetch(`http://localhost:3000/api/teams/league/${leagueId}`);
        if (!response.ok) throw new Error("Erreur API backend");
        const data = await response.json();

        const teamsList: Team[] = data.response.map((item: any) => item.team);
        setTeams(teamsList);
      } catch (error) {
        console.error("Erreur de récupération des équipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [selectedCountry]);

  const nextCountry = () => setSelectedIndex((prev) => (prev + 1) % countries.length);
  const prevCountry = () =>
    setSelectedIndex((prev) => (prev - 1 < 0 ? countries.length - 1 : prev - 1));

  if (loading) return <div style={styles.page}>Chargement...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.wheel}>
        {teams.map((team, index) => {
          const angle = (360 / teams.length) * index;
          const radius = 120;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <div
              key={team.id}
              style={{
                ...styles.clubCard,
                transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
                backgroundColor: index % 2 === 0 ? "#2563eb" : "#374151",
              }}
              onClick={() => navigate(`/club/${team.id}`)}
            >
              <span style={{ transform: `rotate(${-angle}deg)` }}>{team.name}</span>
            </div>
          );
        })}

        <div style={styles.center}>
          <button style={styles.arrowLeft} onClick={prevCountry}>
            ◀
          </button>
          <span>{selectedCountry}</span>
          <button style={styles.arrowRight} onClick={nextCountry}>
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

const wheelSize = 300;

const styles: Record<string, CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f5f5f5",
    color: "#fff",
  },
  wheel: {
    position: "relative",
    width: `${wheelSize}px`,
    height: `${wheelSize}px`,
    borderRadius: "50%",
    background: "#1f2937",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  clubCard: {
    position: "absolute",
    width: "80px",
    height: "30px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
    transition: "transform 0.3s ease",
  },
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#111827",
    borderRadius: "50%",
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "14px",
    padding: "0 10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    zIndex: 2,
  },
  arrowLeft: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
  arrowRight: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
};
