import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import TestPage from "./page/test"; // Ta page test
import AccueilPage from "./page/accueil"; // Ta page accueil
import "./index.css";
import Navbar from"./coponent/navbar"; // Correction du chemin d'importation
import Wheel from "./page/clubChoix"; // Importation de la page club
import ClubPage from "./page/club"; // Importation de la page club avec détails

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<AccueilPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/club" element={<Wheel />} />
        <Route path="/club/:id" element={<ClubPage />} /> {/* Route dynamique */}

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
