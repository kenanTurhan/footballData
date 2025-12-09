// src/pages/Bienvenue.tsx
import { useNavigate } from "react-router-dom";
import "../css/accueil.css";
import equipeImg from "../image/equipe.jpg";
import joueurImg from "../image/joueur.jpg";
import radarImg from "../image/radar2.png";
import courbeImg from "../image/courbe.png";

export default function Bienvenue() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Football Data</h1>
      <div className="cartes">
        <img
          src={equipeImg}
          alt="Équipe"
          className="carte"
          onClick={() => navigate("/club")}
        />
        <img
          src={joueurImg}
          alt="Joueur"
          className="carte"
          onClick={() => navigate("/joueur")}
        />
      </div>
      <p>Mettre les différents graphiques disponibles.</p>

        <h2>Graphiques Disponibles</h2>

      <div className="containerTest">

        <div className="test">
        <img
          src={radarImg}
          alt=""
          style={{ width: "auto", height: 200, cursor: "pointer" }}
          onClick={() => navigate("/radar")}
          />
        </div>
        <div className="test2">
        <img
          src={courbeImg}
          alt=""
          style={{ width: "auto", height: 200, cursor: "pointer" }}
          onClick={() => navigate("/radar")}
          />
        </div>
        <div className="test3">
        <img
          src={radarImg}
          alt=""
          style={{ width: "auto", height: 200, cursor: "pointer" }}
          onClick={() => navigate("/radar")}
          />
        </div>
        <div className="test4">
        <img
          src={radarImg}
          alt=""
          style={{ width: "auto", height: 200, cursor: "pointer" }}
          onClick={() => navigate("/radar")}
          />
        </div>
      </div>
    </div>);
}
