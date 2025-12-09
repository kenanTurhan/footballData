import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchPlayer } from "../hooks/useJoueurSearch";
import { RadarChart, Radar, PolarAngleAxis, PolarRadiusAxis, Legend, PolarGrid, ResponsiveContainer } from "recharts";
import { usePlayerProfile } from "../hooks/useJoueurPage";

import "../css/radarPage.css";

export default function CompareRadarPage() {
  const [query, setQuery] = useState("");
  
  // 1. DÉCLARATION DES ÉTATS POUR LES DEUX JOUEURS
  const [selectedPlayerId1, setSelectedPlayerId1] = useState<number | null>(null); // Ancien selectedPlayerId
  const [selectedPlayerId2, setSelectedPlayerId2] = useState<number | null>(null); // Nouveau pour la comparaison
  
  // 2. NOUVEL ÉTAT POUR GÉRER L'EMPLACEMENT DE SÉLECTION (1 ou 2)
  const [selectingPlayerSlot, setSelectingPlayerSlot] = useState<1 | 2>(1); 

  // CORRECTION: Renommer la variable retournée par useSearchPlayer
  const { players, loading: searchLoading, search } = useSearchPlayer();
  const navigate = useNavigate();

  // 3. CHARGEMENT DES PROFILS DES DEUX JOUEURS
  // Utilisation des IDs corrigés (selectedPlayerId1/2)
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
    const defaultReturn = { radarData: [], domainMax: 100, playerName1: "Pas encore selectionner", playerName2: "Pas encore selectionner" };

    // Fonction utilitaire pour extraire les stats
    const getStats = (player: any) => {
        if (!player || !player.statistics || player.statistics.length === 0) {
            return null;
        }
        return player.statistics[0];
    };

    const stats1 = getStats(player1);
    const stats2 = getStats(player2);

    if (!stats1 && !stats2) {
        return defaultReturn;
    }
    
    // Structure de base des sujets
    const baseSubjects = [
        "Tir", "But", "Passe décisive", "Passe clé", "Dribble réussi", "Duel gagné"
    ];

    // Extraction des valeurs A (Joueur 1) et B (Joueur 2)
    const values1 = stats1 ? [
        stats1.shots.total || 0,
        stats1.goals.total || 0,
        stats1.goals.assists || 0,
        stats1.passes.key || 0,
        stats1.dribbles.success || 0,
        stats1.duels.won || 0,
    ] : [0, 0, 0, 0, 0, 0];

    const values2 = stats2 ? [
        stats2.shots.total || 0,
        stats2.goals.total || 0,
        stats2.goals.assists || 0,
        stats2.passes.key || 0,
        stats2.dribbles.success || 0,
        stats2.duels.won || 0,
    ] : [0, 0, 0, 0, 0, 0];
    
    // Création du tableau de données final pour Recharts
    const finalData = baseSubjects.map((subject, index) => ({
        subject,
        A: values1[index], // Joueur 1
        B: values2[index], // Joueur 2
        fullMark: 100 // Garder une base, mais le domaine Max est ajusté
    }));


    // Calcul du domaine max en prenant en compte les valeurs A et B
    const maxA = Math.max(...values1);
    const maxB = Math.max(...values2);
    const overallMax = Math.max(maxA, maxB) * 1.2; // 20% de marge
    
    // Assurer un max de domaine lisible (multiple de 10) et au moins 100
    const maxDomain = Math.max(100, Math.ceil(overallMax / 10) * 10); 
    
    return { 
        radarData: finalData, 
        domainMax: maxDomain, 
        playerName1: player1?.player.name || "Joueur 1",
        playerName2: player2?.player.name || "Joueur 2",
    };
  }, [player1, player2]); // Dépend des deux objets joueurs

  // 5. FONCTION DE SÉLECTION MISE À JOUR
  const handlePlayerSelect = (id: number) => {
    // Si on sélectionne le Slot 1
    if (selectingPlayerSlot === 1) {
      setSelectedPlayerId1(id);
      // On passe au Slot 2 pour la prochaine sélection
      setSelectingPlayerSlot(2); 
    } else {
      // Si on sélectionne le Slot 2
      setSelectedPlayerId2(id);
      // On peut repasser au Slot 1, ou rester sur 2. Ici on revient à 1.
      setSelectingPlayerSlot(1); 
    }
    // Réinitialiser la recherche pour une nouvelle recherche
    setQuery("");
  };

   const handlePlayerRemove = (slot: number) => {
    if (slot === 1) {
      setSelectedPlayerId1(null);
      playerName1("Pas encore selectionner");
    } else {
      setSelectedPlayerId2(null);
      playerName2(null);
    }
  };

  return (
    <div className="page-joueur">
      <h1>Comparaison radar</h1>
      
      {/* 6. INDICATEUR DE SÉLECTION DANS LA BARRE DE RECHERCHE */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Rechercher le Joueur ${selectingPlayerSlot}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="selection-status">
            Sélectionnez actuellement le **Joueur {selectingPlayerSlot}**
        </div>
      </div>
      <div>
        <p>Joueur1 : {playerName1}</p>           <button onClick={() => handlePlayerRemove(1)}>{"supprimer"}</button>



        <p>Joueur2 : {playerName2}</p>           <button onClick={() => handlePlayerRemove(2)}>{"supprimer"}</button>

      </div>

      {/* Affichage des Résultats de la Recherche */}
      {searchLoading && <p>Recherche en cours…</p>}
      
      <div className="results">
        {players.map((p, i) => {
          const playerStats = p.statistics?.[0]; // p.statistics est l'ARRAY

          const isSelected1 = selectedPlayerId1 === p.player.id;
          const isSelected2 = selectedPlayerId2 === p.player.id;
          
          // Classe CSS pour indiquer quel slot est occupé (voir CSS à la fin)
          const cardClass = `player-card ${isSelected1 ? 'selected-1' : ''} ${isSelected2 ? 'selected-2' : ''}`;

          return (
            <div
              key={p.player.id || i}
              className={cardClass}
              onClick={() => handlePlayerSelect(p.player.id)} // CLIC : SÉLECTIONNE le joueur
            >
              <img src={p.player.photo} alt={p.player.name} />
              <h3>{p.player.name || "Nom inconnu"}</h3>
              {/* {isSelected1 && <span className="selection-indicator player-1">J1</span>}
              {isSelected2 && <span className="selection-indicator player-2">J2</span>} */}
              <p>**{playerStats?.team?.name || "Club inconnu"}**</p>
              <p>Poste : {p.statistics?.[0]?.games.position || "N/A"}</p>
            </div>
          );
        })}
      </div>

      {/* Affichage du Radar Chart de Comparaison */}
      <div className="radar-section">
        <h2>
            {selectedPlayerId1 || selectedPlayerId2 
              ? `Comparaison : ${playerName1} vs ${playerName2}` 
              : "Veuillez sélectionner deux joueurs pour comparer leurs statistiques"}
        </h2>
        
        {(profileLoading1 || profileLoading2) && (selectedPlayerId1 || selectedPlayerId2) && <p>Chargement des statistiques...</p>}
        
        {(selectedPlayerId1 || selectedPlayerId2) && radarData.length > 0 && !(profileLoading1 || profileLoading2) && (
          <div className="chart-container" style={{ maxWidth: 600, margin: '20px auto' }}>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="subject" stroke="#333" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, domainMax]} tickCount={6} stroke="#aaa" /> 
                
                {/* RADAR DU JOUEUR 1 */}
                {selectedPlayerId1 && (
                    <Radar
                        name={playerName1}
                        dataKey="A" // Clé 'A' pour le joueur 1
                        stroke="#8884d8" 
                        fill="#8884d8"
                        fillOpacity={0.7}
                        isAnimationActive={true}
                    />
                )}
                
                {/* RADAR DU JOUEUR 2 */}
                {selectedPlayerId2 && (
                    <Radar
                        name={playerName2}
                        dataKey="B" // Clé 'B' pour le joueur 2
                        stroke="#82ca9d" // Couleur différente
                        fill="#82ca9d"
                        fillOpacity={0.7}
                        isAnimationActive={true}
                    />
                )}
                
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
        {(selectedPlayerId1 || selectedPlayerId2) && radarData.length === 0 && !(profileLoading1 || profileLoading2) && <p>Statistiques détaillées non disponibles pour les joueurs sélectionnés.</p>}
      </div>
    </div>
  );
}