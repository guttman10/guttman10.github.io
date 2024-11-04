// App.js
import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTheme } from './ThemeContext'; // Just useTheme here
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './Footer'; // Import Footer component
import './App.css';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
      <Router>
        <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
          <header className="App-header">
            <h1>My Awesome Website</h1>
            <button onClick={toggleTheme} className="dark-mode-toggle">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />{/*@ ./Footter */}
        </div>
      </Router>
  );
}

export default App;
