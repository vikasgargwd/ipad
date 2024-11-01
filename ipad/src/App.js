import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HorrorStory from './components/HorrorStory';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App" style={{ 
            backgroundColor: '#0a0a0a',
            minHeight: '100vh',
            backgroundImage: 'radial-gradient(circle, transparent 20%, #000000 80%)',
          }}>
            <header className="App-header" style={{ 
              backgroundColor: 'transparent',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <h1 style={{ 
                color: '#bb0000', 
                fontFamily: 'Creepster, cursive',
                fontSize: '4em',
                textShadow: '0 0 10px rgba(200, 0, 0, 0.7), 0 0 20px rgba(200, 0, 0, 0.5)',
                animation: 'pulse 2s infinite',
                margin: '2rem 0'
              }}>
                🦇 Haunted iPad 💀
              </h1>
              <p style={{
                color: '#8b0000',
                fontFamily: 'monospace',
                fontSize: '1.2em',
                textAlign: 'center',
                maxWidth: '600px',
                letterSpacing: '2px'
              }}>
                Warning: Enter at your own risk. What lies beyond cannot be unseen...
              </p>
              <Link
                to="/horror"
                style={{ 
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '1.8em',
                  fontFamily: 'Creepster, cursive',
                  transition: 'all 0.5s ease',
                  marginTop: '2rem',
                  padding: '1rem 2rem',
                  border: '2px solid #bb0000',
                  borderRadius: '5px',
                  backgroundColor: 'rgba(187, 0, 0, 0.1)',
                  cursor: 'pointer',
                  animation: 'flicker 4s linear infinite',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.animation = 'distort 0.3s infinite';
                  const audio = new Audio('/static/horror-sound.mp3'); // Optional: Add a sound effect
                  audio.play().catch(() => {}); // Catch errors if audio fails to play
                }}
                onMouseLeave={(e) => {
                  e.target.style.animation = 'flicker 4s linear infinite';
                }}
              >
                Enter the Nightmare...
              </Link>
            </header>
          </div>
        } />
        <Route path="/horror" element={<HorrorStory />} />
      </Routes>
    </Router>
  );
}

export default App;
