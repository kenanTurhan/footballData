import React, { useState, useEffect, useCallback } from "react";
// Importation explicite du type JSX pour TypeScript
import type { JSX } from "react"; 
import { useNavigate } from "react-router-dom";

// Import du CSS avec le nouveau design "Pro Sport"
import "../css/TeamSelector.css"; 

// --- Types & Interfaces ---

type Team = {
  id: number;
  name: string;
  logo: string;
};

type CountryLeague = {
  name: string;
  leagueId: number;
  code?: string; // Code pays optionnel (ex: FR, UK) pour extensions futures
};

// --- Constantes ---

const COUNTRIES: CountryLeague[] = [
  { name: "France", leagueId: 61, code: "FR" },
  { name: "Espagne", leagueId: 140, code: "ES" },
  { name: "Angleterre", leagueId: 39, code: "EN" },
  { name: "Turquie", leagueId: 203, code: "TR" },
  { name: "Italie", leagueId: 135, code: "IT" },
  { name: "Allemagne", leagueId: 78, code: "DE" },
];

export default function TeamSelector(): JSX.Element {
  // État initial (par défaut Angleterre / Premier League car populaire)
  const initialCountry = COUNTRIES.find(c => c.leagueId === 39) || COUNTRIES[0];
  
  const [selectedCountry, setSelectedCountry] = useState<CountryLeague>(initialCountry);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // --- Logique métier ---

  const fetchTeams = useCallback(async (leagueId: number) => {
    setLoading(true);
    setError(null);
    setTeams([]);
    
    try {
      // Appel API réel
      const response = await fetch(`/api/teams/league/${leagueId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }
      
      const data = await response.json();

      if (Array.isArray(data.response)) {
        // Transformation des données pour correspondre à notre type Team
        const teamsList: Team[] = data.response
          .map((item: any) => ({
            id: item.team.id,
            name: item.team.name,
            logo: item.team.logo || "https://via.placeholder.com/150?text=No+Logo",
          }))
          // Tri alphabétique pour un rendu "Catalogue" propre
          .sort((a: Team, b: Team) => a.name.localeCompare(b.name));

        setTeams(teamsList);
      } else {
        // Pas d'erreur http, mais format inattendu ou vide
        setTeams([]);
      }
    } catch (err) {
      console.error("Erreur fetchTeams:", err);
      setError("Impossible de récupérer les données du championnat.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Déclenchement du fetch au changement de pays
  useEffect(() => {
    fetchTeams(selectedCountry.leagueId);
  }, [selectedCountry, fetchTeams]);

  // Handlers
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const country = COUNTRIES.find(c => c.name === selectedName);
    if (country) {
      setSelectedCountry(country);
    }
  };

  const handleTeamClick = (teamId: number) => {
    navigate(`/club/${teamId}`);
  };

  // --- Rendu TSX ---

  return (
    <div className="ts-wrapper">
      {/* Grille décorative en background (gérée par CSS) */}
      <div className="ts-background-grid" aria-hidden="true"></div>
      
      {/* En-tête typographique */}
      <header className="ts-header">
        <h2 className="ts-subtitle">DATA SCOUTING // SÉLECTEUR</h2>
        <h1 className="ts-title">CHOISISSEZ VOTRE CLUB</h1>
        <div className="ts-divider"></div>
      </header>

      {/* Contrôles de sélection */}
      <div className="ts-controls">
        <div className="ts-select-group">
          <label htmlFor="country-select" className="ts-label">
            CHAMPIONNAT CIBLE
          </label>
          <div className="ts-select-container">
            <select
              id="country-select"
              value={selectedCountry.name}
              onChange={handleCountryChange}
              className="ts-select"
              disabled={loading}
            >
              {COUNTRIES.map((country) => (
                <option key={country.leagueId} value={country.name}>
                  {country.name.toUpperCase()}
                </option>
              ))}
            </select>
            {/* Flèche custom en CSS pur */}
            <div className="ts-select-arrow"></div>
          </div>
        </div>
      </div>
      
      {/* Zone de contenu principale */}
      <main className="ts-content">
        
        {/* État de Chargement */}
        {loading && (
          <div className="ts-loader-container">
            <div className="ts-spinner"></div>
            <span className="ts-loading-text">ANALYSE EN COURS...</span>
          </div>
        )}

        {/* État d'Erreur */}
        {error && (
          <div className="ts-message error">
            <strong>ERREUR SYSTÈME</strong><br/>
            {error}
          </div>
        )}

        {/* Grille de résultats */}
        {!loading && !error && teams.length > 0 && (
          <div className="ts-grid">
            {teams.map((team) => (
              <div 
                key={team.id} 
                className="ts-card"
                onClick={() => handleTeamClick(team.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleTeamClick(team.id);
                }}
              >
                <div className="ts-card-inner">
                  <div className="ts-logo-box">
                    <img 
                      src={team.logo} 
                      alt={`Logo ${team.name}`} 
                      className="ts-logo"
                      loading="lazy"
                    />
                  </div>
                  <div className="ts-card-info">
                    <h3 className="ts-team-name">{team.name}</h3>
                    <span className="ts-cta">ACCÉDER AUX STATS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* État Vide */}
        {!loading && !error && teams.length === 0 && (
          <div className="ts-message">
            AUCUNE DONNÉE DISPONIBLE POUR CE CRITÈRE.
          </div>
        )}
      </main>
    </div>
  );
}
