import CasinoIcon from '@mui/icons-material/Casino';
import React, { useEffect, useState, useRef } from 'react'
import { SnakeGame } from './SnakeGame';

export const Pun = ({ onBack }) => {
  const [inputName, setInputName] = useState('');
  const containerRef = useRef(null);

  const [showWelcome, setShowWelcome] = useState(true);
  const [showLuckyDraw, setShowLuckyDraw] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showError, setShowError] = useState(false);

  // Slot Machine State
  const [slots, setSlots] = useState(['7', '7', '7']);
  const [isSpinning, setIsSpinning] = useState(false);
  const slotSymbols = ['7', '🍒', '💎', '🔔', '🍀', '🍋'];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      setSlots([
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)]
      ]);
      spins++;
      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const handleLogin = () => {
    if (inputName !== '') {
      setShowLogin(false);
      setShowError(true);
    }
  };

  return (
    <div
      className="min-h-screen font-retro bg-black flex flex-col items-center text-green-400 overflow-hidden relative"
    >
      {/* Retro Background Grid Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(transparent 95%, #0f0 95%), linear-gradient(90deg, transparent 95%, #0f0 95%)',
          backgroundSize: '40px 40px'
        }}>
      </div>

      {/* Login Button */}
      <div className="absolute top-4 z-50 flex w-full justify-between px-2">
        <div
          className="text-white font-bold py-2 px-2 text-center active:border-b-0 active:translate-y-1 transition-all uppercase text-xs items-center"
        >
          <CasinoIcon fontSize="large" color='secondary'
            onClick={() => setShowLuckyDraw(true)} />
          <br />
          <p className='text-yellow-500 '>Spin</p>
        </div>
        <button
          onClick={() => setShowLogin(true)}
          className="bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 hover:bg-blue-500 transition-all uppercase text-xs"
        >
          LOGIN
        </button>
      </div>

      {/* Welcome Popup */}
      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[60]">
          <div className="bg-gray-800 border-4 border-green-500 p-8 shadow-[10px_10px_0px_0px_rgba(0,255,0,0.5)] text-center max-w-md mx-4">
            <h2 className="text-2xl text-yellow-400 mb-6 uppercase tracking-widest animate-pulse">ຍິນດີຕ້ອນຮັບ</h2>
            <p className="text-green-400 mb-8 text-sm leading-loose ">
              ພ້ອມທີ່ຈະຫຼິ້ນເກມແລ້ວບໍ່?<br />
              <span className="text-yellow-400 font-bold">Quest     :   </span>
              ທຳລາຍສະຖິຕິໄດ້ຮັບໄປເລີຍມູນຄ່າໂທ 10.000 kip
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="bg-red-600 text-white font-bold py-4 px-8 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 hover:bg-red-500 transition-all uppercase"
            >
              ເລີ່ມເກມ
            </button>
          </div>
        </div>
      )}

      {showLuckyDraw && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[60]">
          <div className="bg-gray-800 border-4 border-yellow-500 p-8 shadow-[10px_10px_0px_0px_rgba(255,215,0,0.5)] text-center max-w-md mx-4 relative">
            <button
              onClick={() => setShowLuckyDraw(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-3xl text-yellow-400 mb-8 uppercase tracking-widest animate-pulse drop-shadow-[2px_2px_0_#ff0000]">
              SPIN TO WIN
            </h2>

            {/* Slot Machine Display */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-8 bg-black p-4 sm:p-6 border-4 border-gray-600 rounded-lg overflow-x-auto">
              {slots.map((symbol, index) => (
                <div key={index} className="w-12 h-16 sm:w-16 sm:h-24 bg-white flex items-center justify-center text-2xl sm:text-4xl border-b-4 border-gray-300 rounded overflow-hidden relative flex-shrink-0">
                  <div className={`transition-transform duration-100 ${isSpinning ? 'animate-pulse' : ''}`}>
                    {symbol}
                  </div>
                  {/* Glass reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full font-bold py-4 px-8 border-b-4 active:border-b-0 active:translate-y-1 transition-all uppercase text-xl
                ${isSpinning
                  ? 'bg-gray-600 border-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 border-red-800 text-white hover:bg-red-500'}`}
            >
              {isSpinning ? 'SPINNING...' : 'SPIN!'}
            </button>

            <p className="mt-4 text-xs text-yellow-500">BONUS COMING SOON (KHR KHIT KRN)</p>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[70]">
          <div className="p-6 bg-blue-900 border-4 border-white flex flex-col items-center w-full max-w-sm mx-4 shadow-[10px_10px_0_#000]">
            <p className="mb-6 text-white text-center leading-relaxed">
              ENTER PLAYER NAME<br />
            </p>
            <input
              type="text"
              onChange={(e) => setInputName(e.target.value)}
              value={inputName}
              className="w-full bg-black text-green-500 p-3 border-2 border-green-500 font-retro focus:outline-none focus:border-green-300 mb-6 text-center uppercase"
              placeholder="NAME..."
            />
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 bg-gray-600 text-white py-3 border-b-4 border-gray-800 hover:bg-gray-500 active:border-b-0 active:translate-y-1"
                onClick={() => setShowLogin(false)}
              >
                CANCEL
              </button>
              <button
                className="flex-1 bg-yellow-500 text-black py-3 border-b-4 border-yellow-700 hover:bg-yellow-400 active:border-b-0 active:translate-y-1"
                onClick={handleLogin}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[80]">
          <div className='text-center animate-bounce p-8 border-4 border-red-600 bg-black'>
            <p className='text-3xl text-red-500 mb-4'>FATAL ERROR</p>
            <p className='text-xl text-white mb-8'>

            </p>
            <button
              className="bg-red-600 text-white py-3 px-8 border-b-4 border-red-800 hover:bg-red-500 active:border-b-0 active:translate-y-1 uppercase"
              onClick={() => setShowError(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="w-full text-center py-8 z-10">
        <h1 className="text-4xl md:text-6xl text-yellow-400 drop-shadow-[4px_4px_0_#ff00ff] animate-pulse">
          ປັ່ນ ຊື່ ດອກ
        </h1>
        <div className="mt-2 text-pink-500 text-xs tracking-[0.5em]">HIGH SCORE: 999999</div>
      </div>

      {/* Game Area */}
      <div ref={containerRef} className="h-min relative flex-1 w-full flex justify-center items-center overflow-hidden z-10">
        <div className="fixed inset-0 z-50 bg-black">
          <SnakeGame onBack={onBack} />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-gray-900 border-t-4 border-gray-700 py-4 text-center z-10">
        <p className="text-xs text-gray-500">CREDITS:
          <a
            className="text-green-500 ml-2 hover:text-green-400 hover:underline"
            href="https://www.facebook.com/share/19jkLvKysj/?mibextid=wwXIfr">
            PANO NOSAVANH
          </a> </p>

      </div>
    </div>
  )
}
