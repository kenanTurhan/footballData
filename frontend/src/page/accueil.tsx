// src/pages/Bienvenue.tsx
import { useNavigate } from "react-router-dom";
import "../css/accueil.css";
import equipeImg from "../image/equipe.jpg";
import joueurImg from "../image/joueur.jpg";

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
          onClick={() => navigate("/page2")}
        />
      </div>
    </div>
  );
}
