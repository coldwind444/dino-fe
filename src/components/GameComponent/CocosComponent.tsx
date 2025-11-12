// src/components/CocosGame.jsx
import { useEffect, useRef, useState } from 'react';

function CocosGame() {
  const iframeRef = useRef(null);
  const [isReady, setIsReady] = useState(false); // Track iframe ready state
  const [gameData, setGameData] = useState({
    score: 0,
    isPlaying: false,
    currentGame: null
  });

  // Lắng nghe messages từ Cocos
  useEffect(() => {
    const handleMessage = (event) => {
      // Bỏ qua messages không hợp lệ
      if (!event.data || typeof event.data !== 'object') {
        return;
      }

      const { type, payload } = event.data;
      
      console.log('Frontend received from Cocos:', type, payload);
      
      switch(type) {
        case 'COCOS_READY':
          console.log('Cocos is ready!');
          setIsReady(true);
          break;

        case 'GAME_SWITCHED':
          console.log('Game switched to:', payload.gameName);
          setGameData(prev => ({ 
            ...prev, 
            currentGame: payload.gameName 
          }));
          break;
          
        case 'GAME_STARTED':
          setGameData(prev => ({ ...prev, isPlaying: true }));
          break;

        case 'GAME_PAUSED':
          setGameData(prev => ({ ...prev, isPlaying: false }));
          break;
          
        case 'GAME_OVER':
          setGameData(prev => ({ 
            ...prev, 
            isPlaying: false,
            score: payload.score 
          }));
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Gửi message tới Cocos - CHỈ KHI ĐÃ READY
  const sendToCocos = (type, payload) => {
    if (!isReady) {
      console.warn('Cocos is not ready yet!');
      return;
    }

    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message = { type, payload };
      console.log('Frontend sending to Cocos:', message);
      
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  // Control functions
  const switchToGame = (gameIndex) => {
    sendToCocos('SWITCH_GAME', { gameIndex });
  };

  const startGame = () => {
    sendToCocos('START_GAME', { level: 1 });
  };

  const pauseGame = () => {
    sendToCocos('PAUSE_GAME', {});
  };

  return (
    <div className="cocos-container">
      <div className="controls">
        <h3>Game Controls</h3>
        
        {/* Các nút chọn game */}
        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => switchToGame(0)} disabled={!isReady}>
            Game 1
          </button>
          <button onClick={() => switchToGame(1)} disabled={!isReady}>
            Game 2
          </button>
          <button onClick={() => switchToGame(2)} disabled={!isReady}>
            Game 3
          </button>
          <button onClick={() => switchToGame(3)} disabled={!isReady}>
            Game 4
          </button>
        </div>

        {/* Controls */}
        <div>
          <button onClick={startGame} disabled={!isReady}>
            Start Game
          </button>
          <button onClick={pauseGame} disabled={!isReady}>
            Pause
          </button>
        </div>
      </div>
      
      <iframe
        ref={iframeRef}
        src="/web-desktop/index.html"
        width="1280"
        height="360"
        title="Cocos Game"
        style={{ border: '2px solid #333' }}
      />
    </div>
  );
}

export default CocosGame;