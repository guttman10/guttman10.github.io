// src/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="App-footer">
      <p>&copy; {new Date().getFullYear()} Omer Guttman. All rights reserved. (Alek)</p>
      <div className="footer-links">
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="https://github.com/guttman10" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </footer>
  );
}

export default Footer;
