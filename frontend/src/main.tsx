import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import TestPage from "./page/test"; // Ta page test
import AccueilPage from "./page/accueil"; // Ta page accueil
import "./index.css";
import Navbar from"./coponent/navbar"; // Correction du chemin d'importation
import Footer from "./coponent/footer";
import Wheel from "./page/clubChoix"; // Importation de la page club
import ClubPage from "./page/club"; // Importation de la page club avec détails
import JoueurSearch from "./page/joueurRecherche"; // Importation de la page de recherche de joueurs
import PlayerPage from "./page/playerPage"; // Importation de la page joueur avec détails
import RadarPage from "./page/radarPage"; // Importation de la page radar
import SeoHead from "./coponent/seoHead";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SeoHead />
      <Navbar />
      <Routes>
        <Route path="/" element={<AccueilPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/club" element={<Wheel />} />
        <Route path="/club/:id" element={<ClubPage />} /> {/* Route dynamique */}
        <Route path="/joueur" element={<JoueurSearch />} />
        <Route path="/joueur/:id" element={<PlayerPage />} />
        <Route path="/radar" element={<RadarPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);
