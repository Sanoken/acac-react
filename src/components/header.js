import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">A Clear's A Clear</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Users">Users</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
