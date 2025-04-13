// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>
        <Link to="/">My Minimalist Blog</Link> {/* Link to homepage */}
      </h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link> {/* Link to homepage */}
          </li>
          <li>
            <Link to="/about">About</Link> {/* Link to about page */}
          </li>
          {/* Add other navigation links here */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;