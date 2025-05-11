// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>
        <Link to="/">Diego del Alamo's personal site</Link> {/* Link to homepage */}
      </h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link> {/* Link to homepage */}
          </li>
          <li>
            <Link to="/CV">CV</Link> {/* Link to about page */}
          </li>
          <li>
            <Link to="https://publish.obsidian.md/ddelalamo/Sorted_notes/Protein+structural+modeling+and+design+Zettelkasten">Notes</Link> {/* Link to about page */}
          </li>
          {/* Add other navigation links here */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
