// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import "../css/navbar.css";
import logo from "../image/logo.png";
import langue from "../image/langue.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
        <div className="logo"><img src={logo} alt="" /></div>
      </NavLink>

      <ul className="nav-links">
        <li>
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
        <div className="langue"><img src={langue} alt="" /></div>
      </NavLink>
        </li>
        <li>
          <a href="https://github.com/kenanTurhan/" target="_blank" rel="noopener noreferrer" className="github-link">
            GitHub
          </a>
        </li>
        <li>
          <NavLink to="/page2" className={({ isActive }) => isActive ? "active" : ""}>
            X
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
