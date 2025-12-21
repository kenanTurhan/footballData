// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import "../css/navbar.css";
import logo from "../image/logo.png";
import langue from "../image/langue.png";

export default function Footer() {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
        <div className="navbar-logo"><img src={logo} alt="" /></div>
      </NavLink>

      <ul className="navbar-links">
        <li>
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
        <div className="navbar-lang"><img src={langue} alt="" /></div>
      </NavLink>
        </li>
        <li>
          <a href="https://github.com/kenanTurhan/" target="_blank" rel="noopener noreferrer" className="github-link">
            GitHub
          </a>
        </li>
        <li>
          <a href="https://linkedin.com/in/turhankenan" target="_blank" rel="noopener noreferrer" className="github-link">
            LinkedIn
          </a>
        </li>
      </ul>
    </nav>
  );
}