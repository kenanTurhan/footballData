// src/pages/Bienvenue.tsx
import { useNavigate } from "react-router-dom";
import "../css/accueil.css";
import equipeImg from "../image/equipe.jpg";
import joueurImg from "../image/joueur.jpg";
import radarImg from "../image/radar2.png";
import courbeImg from "../image/courbe.png";

export default function Bienvenue() {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      id: "teams",
      title: "Équipes",
      subtitle: "Explorez les clubs",
      description: "Découvrez les statistiques détaillées des équipes de football des principales ligues européennes.",
      image: equipeImg,
      route: "/club",
      category: "DATA"
    },
    {
      id: "players", 
      title: "Joueurs",
      subtitle: "Analysez les performances",
      description: "Consultez les profils complets et les statistiques individuelles des joueurs professionnels.",
      image: joueurImg,
      route: "/joueur",
      category: "PROFILES"
    }
  ];

  const ribbonFeatures = [
    {
      id: "radar",
      title: "Radar Chart",
      subtitle: "Comparaisons visuelles", 
      description: "Comparez graphiquement les performances de deux joueurs.",
      image: radarImg,
      route: "/radar",
      category: "ANALYTICS"
    },
    {
      id: "curves",
      title: "Courbes",
      subtitle: "Évolution temporelle",
      description: "Visualisez l'évolution des performances avec des graphiques.",
      image: courbeImg,
      route: "/courbes", 
      category: "TRENDS"
    },
    {
      id: "stats",
      title: "Statistiques",
      subtitle: "Données avancées",
      description: "Explorez les statistiques détaillées et les métriques.",
      image: equipeImg,
      route: "/stats",
      category: "STATS"
    },
    {
      id: "predictions",
      title: "Prédictions",
      subtitle: "IA & Analyse",
      description: "Prédictions et analyses basées sur l'intelligence artificielle.",
      image: joueurImg,
      route: "/predictions",
      category: "AI"
    }
  ];

  return (
    <div className="home-wrapper">
      <div className="home-background-grid"></div>
      
      <div className="home-header">
        <div className="home-subtitle">PLATEFORME D'ANALYSE</div>
        <h1 className="home-title">Football Data</h1>
        <div className="home-divider"></div>
        <p className="home-description">
          Découvrez l'univers des données football avec nos outils d'analyse avancés
        </p>
      </div>

      <div className="home-content">
        {/* Cartes principales */}
        <div className="home-main-grid">
          {mainFeatures.map((feature) => (
            <div 
              key={feature.id}
              className="home-card main-card"
              onClick={() => navigate(feature.route)}
            >
              <div className="home-card-inner">
                <div className="home-card-category">{feature.category}</div>
                
                <div className="home-image-box">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="home-feature-image"
                  />
                  <div className="home-image-overlay"></div>
                </div>
                
                <div className="home-card-info">
                  <h3 className="home-feature-title">{feature.title}</h3>
                  <p className="home-feature-subtitle">{feature.subtitle}</p>
                  <p className="home-feature-description">{feature.description}</p>
                </div>
                
                <div className="home-cta">
                  EXPLORER →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ruban de 4 cartes */}
        <div className="home-ribbon">
          <div className="ribbon-title">
            <h2>Outils d'Analyse</h2>
            <div className="ribbon-divider"></div>
          </div>
          <div className="home-ribbon-grid">
            {ribbonFeatures.map((feature) => (
              <div 
                key={feature.id}
                className="home-card ribbon-card"
                onClick={() => navigate(feature.route)}
              >
                <div className="home-card-inner">
                  <div className="home-card-category">{feature.category}</div>
                  
                  <div className="home-image-box ribbon-image">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="home-feature-image"
                    />
                    <div className="home-image-overlay"></div>
                  </div>
                  
                  <div className="home-card-info">
                    <h4 className="home-feature-title">{feature.title}</h4>
                    <p className="home-feature-subtitle">{feature.subtitle}</p>
                    <p className="home-feature-description">{feature.description}</p>
                  </div>
                  
                  <div className="home-cta">
                    VOIR →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
