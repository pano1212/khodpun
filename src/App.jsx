import React, { useState } from 'react';
import { Pun } from './pun';
import { SnakeGame } from './SnakeGame';
import { LoginForm } from './LoginForm';

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu', 'pun', 'snake', 'login'

  const renderScreen = () => {
    switch (currentScreen) {
      case 'pun':
        return (
          <div className="relative">
            <button
              onClick={() => setCurrentScreen('menu')}
              className="fixed top-4 left-4 z-[100] bg-gray-800 text-white px-4 py-2 font-retro text-xs border-2 border-white hover:bg-gray-700"
            >
              &lt; MENU
            </button>
            <Pun onBack={() => setCurrentScreen('menu')} />
          </div>
        );
      case 'snake':
        return <SnakeGame onBack={() => setCurrentScreen('menu')} />;
      case 'login':
        return <LoginForm onBack={() => setCurrentScreen('menu')} />;
      default:
        return (
          <div className="min-h-screen bg-gray-900 font-retro flex flex-col items-center justify-center text-white relative overflow-hidden">
            {/* Retro Background Grid Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'linear-gradient(transparent 95%, #0f0 95%), linear-gradient(90deg, transparent 95%, #0f0 95%)',
                backgroundSize: '40px 40px'
              }}>
            </div>

            <div className="z-10 text-center space-y-12">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl text-yellow-400 drop-shadow-[6px_6px_0_#ff00ff] animate-pulse">
                  RETRO ARCADE
                </h1>
                <p className="text-green-400 tracking-[0.5em] text-sm">SELECT YOUR GAME</p>
              </div>

              <div className="flex flex-col space-y-6 w-64 mx-auto">
                <button
                  onClick={() => setCurrentScreen('pun')}
                  className="bg-blue-600 text-white font-bold py-4 px-8 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 hover:bg-blue-500 transition-all uppercase shadow-[4px_4px_0_#000]"
                >
                  PUN GAME
                </button>
                <button
                  onClick={() => setCurrentScreen('snake')}
                  className="bg-green-600 text-white font-bold py-4 px-8 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 hover:bg-green-500 transition-all uppercase shadow-[4px_4px_0_#000]"
                >
                  SNAKE
                </button>
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="bg-purple-600 text-white font-bold py-4 px-8 border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 hover:bg-purple-500 transition-all uppercase shadow-[4px_4px_0_#000]"
                >
                  LOGIN
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-12">
                © 2024 KHODPUN STUDIOS
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {renderScreen()}
    </div>
  );
}

export default App;
