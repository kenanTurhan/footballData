// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import "../css/navbar.css";

import logo from "../image/logo.png";
import languageIcon from "../image/langue.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <NavLink to="/" className="navbar-logo">
        <img src={logo} alt="FootData logo" />
      </NavLink>

      {/* Navigation droite */}
      <ul className="navbar-links">
        {/* Langue */}
        <li>
          <button className="navbar-lang" aria-label="Changer la langue">
            <img src={languageIcon} alt="Langue" />
          </button>
        </li>

        {/* GitHub */}
        <li>
          <a
            href="https://github.com/kenanTurhan/"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>

        {/* LinkedIn */}
        <li>
          <a
            href="https://linkedin.com/in/turhankenan"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </nav>
  );
}
