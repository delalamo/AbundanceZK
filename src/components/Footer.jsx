// src/components/Footer.jsx
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear(); // Get current year dynamically
  return (
    <footer>
      <p>&copy; {currentYear} Diego del Alamo, PhD. All rights reserved.</p>
    </footer>
  );
}

export default Footer;