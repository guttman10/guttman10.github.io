// src/pages/Home.js
import React from 'react';
import { useTheme } from '../ThemeContext';

function Home() {
  const { isDarkMode } = useTheme();

  return (
    <div className="page">
      <h2>Welcome to My Website</h2>
      <p>The current theme is {isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
    </div>
  );
}

export default Home;