import CasinoIcon from '@mui/icons-material/Casino';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React, { useEffect, useState, useRef } from 'react'
import { SnakeGame } from './SnakeGame';
import { auth, getUserPointsByAuthUid } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';

export const Pun = ({ onBack, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const containerRef = useRef(null);

  const [showWelcome, setShowWelcome] = useState(true);
  const [showLuckyDraw, setShowLuckyDraw] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const points = await getUserPointsByAuthUid(user.uid);
          setUserPoints(points || 0);
        } catch (err) {
          console.error('Error fetching points:', err);
        }
      } else {
        setCurrentUser(null);
        setUserPoints(0);
      }
    });
    return unsubscribe;
  }, []);

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

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter email and password');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsRegistering(false);
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setShowError(true);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsRegistering(false);
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserPoints(0);
    } catch (err) {
      setErrorMessage(err.message);
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

      {/* Login Button / User Info */}
      <div className="absolute top-4 z-50 flex w-full justify-between px-2">
        <div
          className="text-white font-bold py-2 px-2 text-center active:border-b-0 active:translate-y-1 transition-all uppercase text-xs items-center"
        >
          <CasinoIcon fontSize="large" color='secondary'
            onClick={() => setShowLuckyDraw(true)} />
          <br />
          <p className='text-yellow-500 '>Spin</p>
        </div>
        
        {currentUser ? (
          <div className="flex gap-2 items-center">
            <div className="bg-green-600 text-white font-bold py-2 px-3 border-b-2 border-green-800 text-xs text-center">
              <p className="text-yellow-300 text-sm">{currentUser.email.split('@')[0]}</p>
              <p className="text-green-200 text-xs">⭐ {userPoints}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-bold py-2 px-4 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 hover:bg-red-500 transition-all uppercase text-xs"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 hover:bg-blue-500 transition-all uppercase text-xs"
          >
            LOGIN
          </button>
        )}
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

      {/* Login/Register Popup - IMPROVED UX */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/85 z-[70] p-4">
          <div className="relative w-full max-w-md bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5),10px_10px_0_#000]">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowLogin(false);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsRegistering(false);
                setErrorMessage('');
              }}
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 border-2 border-red-800 text-white font-bold rounded-full hover:bg-red-500 transition-all text-lg"
            >
              ✕
            </button>

            {/* Header */}
            <div className="bg-black border-b-4 border-cyan-400 p-4">
              <h2 className="text-center text-xl text-cyan-400 font-bold uppercase tracking-widest drop-shadow-[2px_2px_0_#ff00ff]">
                ⚡ {isRegistering ? 'CREATE ACCOUNT' : 'PLAYER LOGIN'} ⚡
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-4 bg-black/50 border-b-2 border-cyan-400">
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setErrorMessage('');
                }}
                className={`flex-1 py-3 px-4 font-bold uppercase text-sm border-2 transition-all ${
                  !isRegistering
                    ? 'bg-yellow-500 text-black border-yellow-600 shadow-[4px_4px_0_#000]'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                🔓 LOGIN
              </button>
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setErrorMessage('');
                }}
                className={`flex-1 py-3 px-4 font-bold uppercase text-sm border-2 transition-all ${
                  isRegistering
                    ? 'bg-green-500 text-black border-green-600 shadow-[4px_4px_0_#000]'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                ✚ REGISTER
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4">
              {/* Error Message - Enhanced Display */}
              {errorMessage && (
                <div className="bg-red-900/80 border-2 border-red-500 p-3 rounded shadow-[inset_0_0_10px_rgba(255,0,0,0.3)]">
                  <p className="text-red-200 text-sm font-bold">⚠️ ERROR</p>
                  <p className="text-red-100 text-xs mt-1">{errorMessage}</p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full bg-black text-green-400 p-3 border-2 border-green-500 font-retro focus:outline-none focus:border-green-300 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition-all"
                  placeholder="player@arcade.com"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && (isRegistering ? handleRegister() : handleLogin())}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                  🔐 Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full bg-black text-green-400 p-3 border-2 border-green-500 font-retro focus:outline-none focus:border-green-300 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition-all pr-10"
                    placeholder="••••••••"
                    disabled={loading}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && (isRegistering ? handleRegister() : handleLogin())}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-300 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password - Only on Register */}
              {isRegistering && (
                <div>
                  <label className="block text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                    ✓ Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      className="w-full bg-black text-green-400 p-3 border-2 border-green-500 font-retro focus:outline-none focus:border-green-300 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition-all pr-10"
                      placeholder="••••••••"
                      disabled={loading}
                      onKeyPress={(e) => e.key === 'Enter' && !loading && handleRegister()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-300 transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Password Strength Indicator - Only on Register */}
              {isRegistering && password && (
                <div className="bg-black/50 border-2 border-yellow-500 p-2">
                  <p className="text-yellow-400 text-xs font-bold mb-1">PASSWORD STRENGTH</p>
                  <div className="flex gap-1">
                    <div className={`flex-1 h-2 border border-yellow-600 ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    <div className={`flex-1 h-2 border border-yellow-600 ${password.length >= 10 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    <div className={`flex-1 h-2 border border-yellow-600 ${password.match(/[0-9]/) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                  </div>
                  <p className="text-yellow-200 text-xs mt-1">
                    {password.length < 6 ? 'Weak' : password.length < 10 ? 'Medium' : password.match(/[0-9]/) ? 'Strong' : 'Medium'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border-t-2 border-cyan-400 p-4 space-y-3">
              <button
                onClick={isRegistering ? handleRegister : handleLogin}
                disabled={loading}
                className={`w-full py-3 px-4 border-b-4 uppercase font-bold text-lg transition-all disabled:opacity-50 ${
                  isRegistering
                    ? 'bg-green-500 text-black border-green-700 hover:bg-green-400 active:border-b-0 active:translate-y-1'
                    : 'bg-yellow-500 text-black border-yellow-700 hover:bg-yellow-400 active:border-b-0 active:translate-y-1'
                }`}
              >
                {loading ? (
                  <>
                    ⏳ {isRegistering ? 'CREATING...' : 'SIGNING IN...'}
                  </>
                ) : (
                  <>
                    {isRegistering ? '✚ REGISTER NEW PLAYER' : '▶ START GAME'}
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setShowLogin(false);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setIsRegistering(false);
                  setErrorMessage('');
                }}
                disabled={loading}
                className="w-full py-3 px-4 border-b-4 bg-gray-700 text-white border-gray-900 hover:bg-gray-600 active:border-b-0 active:translate-y-1 uppercase font-bold transition-all disabled:opacity-50"
              >
                ✕ CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[80]">
          <div className='text-center animate-bounce p-8 border-4 border-red-600 bg-black max-w-md mx-4'>
            <p className='text-3xl text-red-500 mb-4'>ERROR</p>
            <p className='text-lg text-white mb-8'>
              {errorMessage || 'Something went wrong!'}
            </p>
            <button
              className="bg-red-600 text-white py-3 px-8 border-b-4 border-red-800 hover:bg-red-500 active:border-b-0 active:translate-y-1 uppercase"
              onClick={() => {
                setShowError(false);
                setErrorMessage('');
              }}
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
          <SnakeGame 
            onBack={onBack} 
            currentUser={currentUser} 
            onShowLogin={() => setShowLogin(true)}
          />
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
