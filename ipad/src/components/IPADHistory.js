import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenAI from 'openai';
import './IPADHistory.css';

function IPADHistory() {
  const [loading, setLoading] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showHacker, setShowHacker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearchTime, setLastSearchTime] = useState(0);
  const SEARCH_COOLDOWN = 2000; // 2 seconds between searches
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesis = window.speechSynthesis;

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // This is required for client-side usage
  });

  useEffect(() => {
    // Initial loading
    const loadingTimer = setTimeout(() => {
      setLoading(false);
      setShowTitle(true);
    }, 5000);

    // Show hacker screen
    const hackerTimer = setTimeout(() => {
      setShowTitle(false);
      setShowHacker(true);
    }, 15000);

    // Show search interface
    const searchTimer = setTimeout(() => {
      setShowHacker(false);
      setShowSearch(true);
    }, 25000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(hackerTimer);
      clearTimeout(searchTimer);
    };
  }, []);

  // Function to handle text-to-speech
  const speakText = (text) => {
    speechSynthesis.cancel();

    // Split text into shorter segments for more dramatic effect
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    sentences.forEach((sentence, index) => {
      const utterance = new SpeechSynthesisUtterance(sentence);
      
      // Horror voice configuration
      utterance.rate = 0.8; // Slower rate
      utterance.pitch = 0.5; // Much lower pitch
      utterance.volume = 1.0;
      
      // Get available voices
      const voices = speechSynthesis.getVoices();
      // Try to find a deep voice
      const preferredVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.toLowerCase().includes('deep') ||
        voice.name.toLowerCase().includes('dark')
      ) || voices[0];
      
      utterance.voice = preferredVoice;

      // Add dramatic pauses between sentences
      if (index > 0) {
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, index * 800); // 800ms pause between sentences
      } else {
        speechSynthesis.speak(utterance);
      }

      // Handle speaking status
      utterance.onstart = () => {
        setIsSpeaking(true);
        // Add horror background sound
        playHorrorAmbience();
      };
      
      utterance.onend = () => {
        if (index === sentences.length - 1) {
          setIsSpeaking(false);
          stopHorrorAmbience();
        }
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        stopHorrorAmbience();
      };
    });
  };

  // Create horror ambience
  const playHorrorAmbience = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator for background drone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(50, audioContext.currentTime); // Low frequency drone
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime); // Low volume
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    // Store audio nodes for cleanup
    window.horrorSound = { oscillator, gainNode, audioContext };
  };

  const stopHorrorAmbience = () => {
    if (window.horrorSound) {
      window.horrorSound.oscillator.stop();
      window.horrorSound.audioContext.close();
      window.horrorSound = null;
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    stopHorrorAmbience();
    setIsSpeaking(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      stopHorrorAmbience();
    };
  }, []);

  // Add visual effects during speech
  useEffect(() => {
    if (isSpeaking) {
      document.body.classList.add('speaking-active');
    } else {
      document.body.classList.remove('speaking-active');
    }
  }, [isSpeaking]);

  const handleSearch = async () => {
    const now = Date.now();
    if (now - lastSearchTime < SEARCH_COOLDOWN) {
      setError('Please wait a moment before searching again.');
      return;
    }

    setLastSearchTime(now);
    setIsLoading(true);
    setError(null);
    
    try {
      // Direct ChatGPT API call
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a paranormal researcher specializing in supernatural phenomena. Provide detailed but concise explanations about paranormal entities and occurrences."
          },
          {
            role: "user",
            content: `Tell me about ${searchTerm} in the context of paranormal activity and supernatural phenomena. Include any historical sightings, cultural significance, and reported characteristics.`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const responseText = completion.choices[0].message.content;
      setSearchResult(responseText);
      
      // Automatically speak the result
      speakText(responseText);

      // Image search
      const mediaResponse = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: {
          query: `${searchTerm} paranormal supernatural`,
          client_id: process.env.REACT_APP_UNSPLASH_API_KEY
        }
      });

      if (mediaResponse.data.results.length > 0) {
        setMediaUrl(mediaResponse.data.results[0].urls.regular);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Error performing search. Please try again.');
      setSearchResult('');
      stopSpeaking();
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="blood-loading">Loading...</div>
      </div>
    );
  }

  if (showTitle) {
    return (
      <div className="ipad-history-container">
        <h1 className="horror-title">Internet Paranormal Associated Department</h1>
      </div>
    );
  }

  if (showHacker) {
    return (
      <div className="ipad-history-container">
        <div className="hacker-screen">
          <div className="code-rain">
            <div className="code-stream-1">SYSTEM BREACH 警告 WARNING ALERT データ流出 GHOST IN THE MACHINE</div>
            <div className="code-stream-2">ERROR 404 PARANORMAL ACTIVITY DETECTED 悪魔 デーモン</div>
            <div className="code-stream-3">CLASSIFIED DATA 機密情報 SUPERNATURAL ENTITY 幽霊</div>
            <div className="code-stream-4">SECURITY COMPROMISED システムエラー HAUNTED CODE</div>
          </div>
          <div className="terminal-text">
            ACCESSING CLASSIFIED FILES...
            <br />
            SECURITY BREACH DETECTED...
            <br />
            DOWNLOADING PARANORMAL DATA...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-container">
      <div className="search-column">
        <h2>Search Paranormal Database</h2>
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter paranormal entity..."
            className="search-input"
          />
          <button 
            onClick={handleSearch}
            disabled={isLoading}
            className="search-button"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="definition-column">
        <h2>Definition</h2>
        <div className="definition-content">
          {isLoading ? (
            <div className="loading-text">
              <div className="spinner"></div>
              Searching the paranormal archives...
            </div>
          ) : error ? (
            <div className="error-text">{error}</div>
          ) : searchResult ? (
            <div className="result-container">
              <div className="result-text">{searchResult}</div>
              <div className="speech-controls">
                <button 
                  onClick={() => isSpeaking ? stopSpeaking() : speakText(searchResult)}
                  className={`speech-button ${isSpeaking ? 'speaking' : ''}`}
                >
                  {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                </button>
              </div>
            </div>
          ) : (
            <div className="placeholder-text">Enter a search term to begin...</div>
          )}
        </div>
      </div>

      <div className="media-column">
        <h2>Evidence Archive</h2>
        <div className="media-content">
          {mediaUrl && <img src={mediaUrl} alt={searchTerm} />}
        </div>
      </div>
    </div>
  );
}

export default IPADHistory;