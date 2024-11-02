import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HorrorStory() {
  const navigate = useNavigate();

  useEffect(() => {
    // Create and play horror ambience when component mounts
    const ambienceAudio = new Audio('/audio/horror-ambience.mp3');
    ambienceAudio.volume = 0.2;
    ambienceAudio.loop = true;
    
    // Create whisper sound
    const whisperAudio = new Audio('/audio/whisper.mp3');
    whisperAudio.volume = 0.3;

    const playWhisper = () => {
      const randomDelay = Math.random() * 10000 + 5000; // Random delay between 5-15 seconds
      setTimeout(() => {
        whisperAudio.play().catch(() => {});
        if (document.visibilityState === 'visible') {
          playWhisper();
        }
      }, randomDelay);
    };

    // Start audio playback
    const startAudio = () => {
      ambienceAudio.play().catch(() => {});
      playWhisper();
    };

    // Add click event listener to start audio (browsers require user interaction)
    const handleClick = () => {
      startAudio();
      document.removeEventListener('click', handleClick);
    };
    document.addEventListener('click', handleClick);

    // Cleanup function
    return () => {
      ambienceAudio.pause();
      whisperAudio.pause();
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      padding: '2rem',
      color: '#ffffff',
      backgroundImage: 'radial-gradient(circle, transparent 20%, #000000 80%)',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'monospace',
        letterSpacing: '1px',
        lineHeight: '1.6'
      }}>
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(187, 0, 0, 0.2)',
          border: '1px solid #bb0000',
          borderRadius: '4px',
          cursor: 'pointer',
          animation: 'pulse 2s infinite'
        }}>
          🔊 Click anywhere to experience the horror
        </div>

        <h2 style={{
          color: '#bb0000',
          fontFamily: 'Creepster, cursive',
          fontSize: '3em',
          textShadow: '0 0 10px rgba(200, 0, 0, 0.7)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          The Cursed iPad
        </h2>
        
        <p style={{
          animation: 'fadeIn 2s ease-in',
          marginBottom: '1.5rem'
        }}>
          Looking at iPad I recalled my old project named Internet Paranormal Associated Department...
        </p>

        <p style={{
          animation: 'fadeIn 3s ease-in',
          marginBottom: '1.5rem'
        }}>
          That night, strange things began to happen. The iPad would turn on by itself, displaying distorted images 
          and playing whispered voices that seemed to call my name...
        </p>

        <div style={{
          border: '1px solid #bb0000',
          padding: '1rem',
          margin: '2rem 0',
          backgroundColor: 'rgba(187, 0, 0, 0.1)',
          animation: 'pulse 3s infinite'
        }}>
          <p style={{ color: '#ff0000', textAlign: 'center' }}>
            "Every night at 3:33 AM, it shows me things... terrible things..."
          </p>
        </div>

        <p style={{
          animation: 'fadeIn 4s ease-in',
          marginBottom: '1.5rem'
        }}>
          Now I can't get rid of it. Each time I try to throw it away, it returns. 
          Each night the images become more disturbing, more real...
        </p>

        <button 
          onClick={() => navigate('/ipad-history')}
          style={{
            display: 'block',
            margin: '2rem auto',
            padding: '1rem 2rem',
            backgroundColor: '#000',
            border: '2px solid #bb0000',
            color: '#bb0000',
            fontFamily: 'Creepster, cursive',
            fontSize: '1.5em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 15px rgba(187, 0, 0, 0.3)',
            ':hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 0 25px rgba(187, 0, 0, 0.5)',
            }
          }}>
          Click to Know More... If You Dare
        </button>
      </div>
    </div>
  );
}

export default HorrorStory; 