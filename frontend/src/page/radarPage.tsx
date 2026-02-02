import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchPlayer } from "../hooks/useJoueurSearch";
import { RadarChart, Radar, PolarAngleAxis, PolarRadiusAxis, Legend, PolarGrid, ResponsiveContainer } from "recharts";
import { usePlayerProfile } from "../hooks/useJoueurPage";

import "../css/radarPage.css"; // Assurez-vous que ce fichier est présent

export default function CompareRadarPage() {
  const [query, setQuery] = useState("");
  
  // 1. DÉCLARATION DES ÉTATS POUR LES DEUX JOUEURS
  const [selectedPlayerId1, setSelectedPlayerId1] = useState<number | null>(null);
  const [selectedPlayerId2, setSelectedPlayerId2] = useState<number | null>(null);
  
  // 2. NOUVEL ÉTAT POUR GÉRER L'EMPLACEMENT DE SÉLECTION (1 ou 2)
  const [selectingPlayerSlot, setSelectingPlayerSlot] = useState<1 | 2>(1); 

  // CORRECTION: Renommer la variable retournée par useSearchPlayer
  const { players, loading: searchLoading, search } = useSearchPlayer();
  const navigate = useNavigate(); // Non utilisé dans le code actuel, mais conservé

  // 3. CHARGEMENT DES PROFILS DES DEUX JOUEURS
  const { player: player1, loading: profileLoading1 } = usePlayerProfile(selectedPlayerId1 || 0);
  const { player: player2, loading: profileLoading2 } = usePlayerProfile(selectedPlayerId2 || 0);

  // 🕒 Debounce pour la recherche
  useEffect(() => {
    if (query.trim() === "") return;

    const timer = setTimeout(() => {
      search(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // 4. PRÉPARATION DES DONNÉES DE COMPARAISON (useMemo)
  const { radarData, domainMax, playerName1, playerName2 } = useMemo(() => {
    const defaultReturn = { 
        radarData: [], 
        domainMax: 100, 
        playerName1: "Joueur 1 (à sélectionner)", 
        playerName2: "Joueur 2 (à sélectionner)" 
    };

    const getStats = (player: any) => {
        if (!player) {
            return null;
        }
        
        // Le backend retourne soit existingPlayer soit existingPlayer2
        const playerData = player.existingPlayer || player.existingPlayer2;
        if (!playerData) {
            return null;
        }
        
        return playerData;
    };

    const stats1 = getStats(player1);
    const stats2 = getStats(player2);

    // Si aucun joueur n'a de stats, retour par défaut
    if (!stats1 && !stats2) {
        return defaultReturn;
    }
    
    // Structure de base des sujets
    const baseSubjects = [
        "Tir", "But", "Passe décisive", "Passe clé", "Dribble réussi", "Duel gagné"
    ];

    // Extraction des valeurs A (Joueur 1) et B (Joueur 2)
    const values1 = stats1 ? [
        stats1.shoot || 0,           // Tirs
        stats1.goals || 0,           // Buts
        stats1.assists || 0,         // Passes décisives
        stats1.keyPasses || 0,       // Passes clés
        stats1.dribblesSuccess || 0, // Dribbles réussis
        stats1.duelsWon || 0,        // Duels gagnés
    ] : [0, 0, 0, 0, 0, 0];

    const values2 = stats2 ? [
        stats2.shoot || 0,           // Tirs
        stats2.goals || 0,           // Buts
        stats2.assists || 0,         // Passes décisives
        stats2.keyPasses || 0,       // Passes clés
        stats2.dribblesSuccess || 0, // Dribbles réussis
        stats2.duelsWon || 0,        // Duels gagnés
    ] : [0, 0, 0, 0, 0, 0];
    
    // Création du tableau de données final pour Recharts
    const finalData = baseSubjects.map((subject, index) => ({
        subject,
        A: values1[index], // Joueur 1
        B: values2[index], // Joueur 2
        fullMark: 100 
    }));


    // Calcul du domaine max
    const maxA = Math.max(...values1);
    const maxB = Math.max(...values2);
    const overallMax = Math.max(maxA, maxB) * 1.2; 
    
    const maxDomain = Math.max(100, Math.ceil(overallMax / 10) * 10); 
    
    return { 
        radarData: finalData, 
        domainMax: maxDomain, 
        playerName1: stats1?.name || "Joueur 1 (Non sélectionné)",
        playerName2: stats2?.name || "Joueur 2 (Non sélectionné)",
    };
  }, [player1, player2]); 

  // 5. FONCTION DE SÉLECTION MISE À JOUR
  const handlePlayerSelect = (id: number) => {
    // Si le joueur est déjà dans un slot, on ne fait rien
    if (id === selectedPlayerId1 || id === selectedPlayerId2) return;
    
    if (selectingPlayerSlot === 1) {
      setSelectedPlayerId1(id);
      // Passe au slot 2 si celui-ci est vide, sinon on reste sur 1
      setSelectingPlayerSlot(selectedPlayerId2 === null ? 2 : 1); 
    } else {
      setSelectedPlayerId2(id);
      // Passe au slot 1 si celui-ci est vide, sinon on reste sur 2
      setSelectingPlayerSlot(selectedPlayerId1 === null ? 1 : 2); 
    }
    setQuery(""); // Réinitialiser la recherche
  };

  const handlePlayerRemove = (slot: 1 | 2) => {
    if (slot === 1) {
      setSelectedPlayerId1(null);
      setSelectingPlayerSlot(1); // On redirige la prochaine sélection vers le slot 1
    } else {
      setSelectedPlayerId2(null);
      setSelectingPlayerSlot(2); // On redirige la prochaine sélection vers le slot 2
    }
  };

  // Log selection state outside of JSX to avoid returning void in a ReactNode
  console.log(selectedPlayerId1, selectedPlayerId2);

  return (
    <div className="compare-radar-page">
      <h1 className="page-title">Comparaison de Joueurs (Radar)</h1>
      
      {/* SECTION HAUTE : SÉLECTION DES JOUEURS */}
      <div className="selection-header">
        
        {/* Barre de Recherche */}
        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder={`Rechercher le Joueur ${selectingPlayerSlot}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className={`selection-indicator-global slot-${selectingPlayerSlot}`}>
              Sélectionnez le **Joueur {selectingPlayerSlot}**
          </span>
        </div>

        {/* STATUT DES JOUEURS SÉLECTIONNÉS */}
        <div className="selected-players-status">
            
          {/* Joueur 1 */}
          <div className={`player-slot slot-1 ${selectedPlayerId1 ? 'selected' : 'empty'}`}>
              <h3 className="slot-title">Joueur 1</h3>
              <p className="player-name">{playerName1}</p>
              {selectedPlayerId1 && (
                  <button className="remove-btn" onClick={() => handlePlayerRemove(1)}>
                      Supprimer
                  </button>
              )}
          </div>

          {/* Séparateur */}
          <div className="status-separator">VS</div>
            
          {/* Joueur 2 */}
          <div className={`player-slot slot-2 ${selectedPlayerId2 ? 'selected' : 'empty'}`}>
              <h3 className="slot-title">Joueur 2</h3>
              <p className="player-name">{playerName2}</p>
              {selectedPlayerId2 && (
                  <button className="remove-btn" onClick={() => handlePlayerRemove(2)}>
                      Supprimer
                  </button>
              )}
          </div>
        </div>
      </div>

      {/* SECTION DES RÉSULTATS DE RECHERCHE */}
      <div className="results-container">
        {searchLoading && query.length > 0 && <p className="loading-message">Recherche en cours…</p>}
        
        {players.length > 0 && (
            <div className="player-cards-list">
              {players.map((p, i) => {
                const playerStats = p.statistics?.[0];

                const isSelected1 = selectedPlayerId1 === p.player.id;
                const isSelected2 = selectedPlayerId2 === p.player.id;
                
                // Détermine la classe du slot occupé
                let selectedSlotClass = '';
                if (isSelected1 && isSelected2) {
                    selectedSlotClass = 'selected-both'; // Improbable, mais géré
                } else if (isSelected1) {
                    selectedSlotClass = 'selected-1';
                } else if (isSelected2) {
                    selectedSlotClass = 'selected-2';
                }

                const cardClass = `player-card ${selectedSlotClass}`;

                return (
                  <div
                    key={p.player.id || i}
                    className={cardClass}
                    onClick={() => handlePlayerSelect(p.player.id)}
                  >
                    <div className="player-img-container">
                        <img src={p.player.photo} alt={p.player.name} className="player-photo" />
                        {isSelected1 && <span className="selection-badge badge-1">J1</span>}
                        {isSelected2 && <span className="selection-badge badge-2">J2</span>}
                    </div>
                    <div className="player-info">
                        <h3 className="player-name-card">{p.player.name || "Nom inconnu"}</h3>
                        <p className="player-club">**{playerStats?.team?.name || "Club inconnu"}**</p>
                        <p className="player-position">Poste : {p.statistics?.[0]?.games.position || "N/A"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
        )}
      </div>

      {/* SECTION DU RADAR CHART DE COMPARAISON */}
      <div className="radar-section">
        <h2 className="radar-title">
        </h2>

        {(profileLoading1 || profileLoading2) && (selectedPlayerId1 || selectedPlayerId2) && <p className="loading-message">Chargement des statistiques...</p>}

        {(profileLoading1 || profileLoading2) && (selectedPlayerId1 || selectedPlayerId2) && <p className="loading-message">Chargement des statistiques...</p>}
        
        {!(selectedPlayerId1 === null && selectedPlayerId2 === null) && radarData.length > 0 && !(profileLoading1 || profileLoading2) && (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={radarData} outerRadius="80%">
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="subject" stroke="#555" fontSize={14} />
                <PolarRadiusAxis angle={30} domain={[0, domainMax]} tickCount={6} stroke="#aaa" fontSize={12} /> 
                
                {/* RADAR DU JOUEUR 1 */}
                {selectedPlayerId1 && (
                    <Radar
                        name={playerName1}
                        dataKey="A" 
                        stroke="#007bff" // Bleu plus vif
                        fill="#007bff"
                        fillOpacity={0.6}
                        isAnimationActive={true}
                    />
                )}
                
                {/* RADAR DU JOUEUR 2 */}
                {selectedPlayerId2 && (
                    <Radar
                        name={playerName2}
                        dataKey="B" 
                        stroke="#dc3545" // Rouge vif
                        fill="#dc3545"
                        fillOpacity={0.6}
                        isAnimationActive={true}
                    />
                )}
                
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: 14 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
        {/* Message si les données ne sont pas trouvées */}
        {!(selectedPlayerId1 === null && selectedPlayerId2 === null) && radarData.length === 0 && !(profileLoading1 || profileLoading2) && <p className="error-message">Statistiques détaillées non disponibles pour les joueurs sélectionnés ou données insuffisantes.</p>}
      </div>
    </div>
  );
}