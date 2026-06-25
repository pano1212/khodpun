import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Leaderboard } from './components/leaderboard';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;
const TARGET_SCORE = 500; // Target goal for players

export const SnakeGame = ({ onBack, currentUser, onShowLogin }) => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [foods, setFoods] = useState([{ x: 15, y: 15, type: 'normal', points: 10 }]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [deathReason, setDeathReason] = useState(''); // 'wall' or 'self'
    const [highScore, setHighScore] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [playerName, setPlayerName] = useState('');

    const snakeRef = useRef(INITIAL_SNAKE);
    const directionRef = useRef(INITIAL_DIRECTION);
    const nextDirectionRef = useRef(INITIAL_DIRECTION); // Queue for next direction
    const foodsRef = useRef([{ x: 15, y: 15, type: 'normal', points: 10 }]);
    const scoreRef = useRef(0);

    // Load user's personal high score when user logs in
    useEffect(() => {
        if (currentUser) {
            loadUserHighScore();
        } else {
            setHighScore(0);
        }
    }, [currentUser]);

    const loadUserHighScore = async () => {
        try {
            const q = query(
                collection(db, 'leaderboard'),
                where('name', '==', currentUser.email)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setHighScore(userDoc.data().score || 0);
            } else {
                setHighScore(0);
            }
        } catch (error) {
            console.error("Error loading user high score:", error);
        }
    };

    const updateSnake = (newSnake) => {
        snakeRef.current = newSnake;
        setSnake(newSnake);
    };

    const updateDirection = (newDir) => {
        // Check against LAST moved direction to prevent immediate reversals
        const lastDir = lastDirectionRef.current;
        const isOpposite = (lastDir.x === -newDir.x && lastDir.y === -newDir.y);
        
        if (!isOpposite) {
            nextDirectionRef.current = newDir;
        }
    };

    const updateFoods = (newFoods) => {
        foodsRef.current = newFoods;
        setFoods(newFoods);
    };

    const updateScore = (newScore) => {
        scoreRef.current = newScore;
        setScore(newScore);
    };

    const gameLoopRef = useRef();
    const lastDirectionRef = useRef(INITIAL_DIRECTION);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying) return;

            const lastDir = lastDirectionRef.current;

            switch (e.key) {
                case 'ArrowUp':
                    if (lastDir.y === 0) updateDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    if (lastDir.y === 0) updateDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    if (lastDir.x === 0) updateDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    if (lastDir.x === 0) updateDirection({ x: 1, y: 0 });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]);

    const getGameSpeed = () => {
        if (score >= 500) return 90;
        if (score >= 400) return 110;
        if (score >= 300) return 120;
        if (score >= 200) return 130;
        if (score >= 100) return 140;
        return 200;
    };

    const getSpeedLevel = () => {
        if (score >= 500) return 'MAX (5x)';
        if (score >= 400) return 'LEVEL 5 (2x)';
        if (score >= 300) return 'LEVEL 4 (1.7x)';
        if (score >= 200) return 'LEVEL 3 (1.5x)';
        if (score >= 100) return 'LEVEL 2 (1.2x)';
        return 'NORMAL';
    };

    const getSnakeStyles = () => {
        if (score >= 500) {
            return {
                className: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 snake-level-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]',
            };
        }
        if (score >= 400) {
            return {
                className: 'bg-purple-500 snake-level-400 shadow-[0_0_10px_#a855f7]',
            };
        }
        if (score >= 300) {
            return {
                className: 'bg-amber-400 snake-level-300 shadow-[0_0_8px_#fbbf24]',
            };
        }
        if (score >= 200) {
            return {
                className: 'bg-pink-500 snake-level-200 shadow-[0_0_8px_#ec4899]',
            };
        }
        if (score >= 100) {
            return {
                className: 'bg-cyan-400 snake-level-100 shadow-[0_0_6px_#22d3ee]',
            };
        }
        return {
            className: 'bg-green-500',
        };
    };

    // Game Loop
    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const currentSpeed = getGameSpeed();
        gameLoopRef.current = setInterval(() => {
            moveSnake();
        }, currentSpeed);

        return () => clearInterval(gameLoopRef.current);
    }, [isPlaying, gameOver, score]);

    const moveSnake = () => {
        const currentSnake = snakeRef.current;
        let currentDirection = directionRef.current;
        const currentFoods = foodsRef.current;
        const currentScore = scoreRef.current;

        // Apply queued direction if available and valid
        const nextDir = nextDirectionRef.current;
        if (nextDir && !(nextDir.x === currentDirection.x && nextDir.y === currentDirection.y)) {
            // Only apply if NOT opposite direction
            const isOpposite = (currentDirection.x === -nextDir.x && currentDirection.y === -nextDir.y);
            if (!isOpposite) {
                currentDirection = nextDir;
                directionRef.current = nextDir;
                setDirection(nextDir);
                nextDirectionRef.current = null; // Reset queue after use
            }
        }

        const newHead = {
            x: currentSnake[0].x + currentDirection.x,
            y: currentSnake[0].y + currentDirection.y,
        };

        // Check collision with walls
        if (
            newHead.x < 0 ||
            newHead.x >= GRID_SIZE ||
            newHead.y < 0 ||
            newHead.y >= GRID_SIZE
        ) {
            setGameOver(true);
            setIsPlaying(false);
            setDeathReason('wall');
            return;
        }

        // Save last moved direction
        lastDirectionRef.current = currentDirection;

        // Create new snake immediately
        const newSnake = [newHead, ...currentSnake];

        // Check collision with food
        const eatenFoodIndex = currentFoods.findIndex(
            (f) => f.x === newHead.x && f.y === newHead.y
        );

        if (eatenFoodIndex === -1) {
            // Not eating - remove tail
            newSnake.pop();
        }

        // STRICT self collision check: only check against body (not including new head)
        const bodySegments = newSnake.slice(1);
        for (let segment of bodySegments) {
            if (segment.x === newHead.x && segment.y === newHead.y) {
                setGameOver(true);
                setIsPlaying(false);
                setDeathReason('self');
                console.log('Self collision at:', newHead, 'Body length:', bodySegments.length);
                return;
            }
        }

        // If eating, generate new food
        if (eatenFoodIndex !== -1) {
            const eatenFood = currentFoods[eatenFoodIndex];
            const nextScore = currentScore + eatenFood.points;
            updateScore(nextScore);
            generateFoods(newSnake, nextScore);
        }

        updateSnake(newSnake);
    };

    const generateFoods = (currentSnake, currentScore) => {
        const generatedFoods = [];

        // Helper to get random coord not on snake or already generated food
        const getRandomCoord = () => {
            while (true) {
                const coord = {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE),
                };
                const onSnake = currentSnake.some(
                    (segment) => segment.x === coord.x && segment.y === coord.y
                );
                const onFood = generatedFoods.some(
                    (f) => f.x === coord.x && f.y === coord.y
                );
                if (!onSnake && !onFood) return coord;
            }
        };

        if (currentScore === 150 || currentScore === 450) {
            // First food: normal size, label 'x5', worth 50 points
            const coord1 = getRandomCoord();
            generatedFoods.push({
                ...coord1,
                type: 'normal',
                points: +50,
                label: 'x5'
            });

            // Second food: big size, label '-30', worth -30 points
            const coord2 = getRandomCoord();
            generatedFoods.push({
                ...coord2,
                type: 'big',
                points: -50,
                label: '-30'
            });
        } else {
            // Single normal food giving 10 points
            const coord = getRandomCoord();
            generatedFoods.push({
                ...coord,
                type: 'normal',
                points: 10
            });
        }

        updateFoods(generatedFoods);
    };

    const startGame = () => {
        setGameOver(false);
        setIsPlaying(true);
        setDeathReason('');
        setPlayerName('');
        setSubmitting(false);

        // Reset refs and states synchronously
        snakeRef.current = INITIAL_SNAKE;
        setSnake(INITIAL_SNAKE);

        directionRef.current = INITIAL_DIRECTION;
        nextDirectionRef.current = INITIAL_DIRECTION;
        setDirection(INITIAL_DIRECTION);
        lastDirectionRef.current = INITIAL_DIRECTION;

        scoreRef.current = 0;
        setScore(0);

        generateFoods(INITIAL_SNAKE, 0);
    };

    const submitScore = async () => {
        setSubmitting(true);
        try {
            // Get current high score from DB in real-time
            const q = query(
                collection(db, 'leaderboard'),
                where('name', '==', currentUser.email)
            );
            const querySnapshot = await getDocs(q);
            
            let currentHighScore = 0;
            let existingDocId = null;
            
            if (!querySnapshot.empty) {
                currentHighScore = querySnapshot.docs[0].data().score || 0;
                existingDocId = querySnapshot.docs[0].id;
            }

            // Submit if: 1) First time (no record yet) 2) Score is higher than current high score
            if (score > currentHighScore) {
                if (existingDocId) {
                    // Update existing record
                    const userDocRef = doc(db, 'leaderboard', existingDocId);
                    await updateDoc(userDocRef, {
                        score: score,
                        timestamp: serverTimestamp()
                    });
                } else {
                    // Create new record
                    await addDoc(collection(db, 'leaderboard'), {
                        name: currentUser.email,
                        score: score,
                        timestamp: serverTimestamp()
                    });
                }
                setHighScore(score);
            } else {
                console.log("Score is not higher than personal high score. Not submitting.");
            }
        } catch (error) {
            console.error("Error submitting score:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const touchStartRef = useRef({ x: 0, y: 0 });

    const handleTouchStart = (e) => {
        if (!isPlaying) return;
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e) => {
        if (!isPlaying) return;
        const touch = e.changedTouches[0];
        const diffX = touch.clientX - touchStartRef.current.x;
        const diffY = touch.clientY - touchStartRef.current.y;

        const threshold = 30; // Minimum drag to trigger direction change
        const lastDir = lastDirectionRef.current;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    if (lastDir.x === 0) updateDirection({ x: 1, y: 0 });
                } else {
                    if (lastDir.x === 0) updateDirection({ x: -1, y: 0 });
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > threshold) {
                if (diffY > 0) {
                    if (lastDir.y === 0) updateDirection({ x: 0, y: 1 });
                } else {
                    if (lastDir.y === 0) updateDirection({ x: 0, y: -1 });
                }
            }
        }
    };

    useEffect(() => {
        if (gameOver && currentUser && score > 0) {
            submitScore();
        }
    }, [gameOver, currentUser, score]);

    return (
        <div className="min-h-screen bg-gray-900 font-retro flex flex-col items-center justify-center text-green-400 relative overflow-hidden">
            {/* Custom Snake Level Animations */}
            <style>{`
                @keyframes level100 {
                    0%, 100% { opacity: 0.85; filter: brightness(0.95); }
                    50% { opacity: 1; filter: brightness(1.25); }
                }
                @keyframes level200 {
                    0%, 100% { box-shadow: 0 0 4px #ec4899; filter: saturate(1.0); }
                    50% { box-shadow: 0 0 16px #ec4899; filter: saturate(1.6); }
                }
                @keyframes level300 {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.4); }
                }
                @keyframes level400 {
                    0%, 100% { transform: scale(1.0); }
                    50% { transform: scale(1.15); }
                }
                @keyframes level500 {
                    0% { filter: hue-rotate(0deg) brightness(1.2); transform: scale(1.0); }
                    50% { transform: scale(1.22); }
                    100% { filter: hue-rotate(360deg) brightness(1.2); transform: scale(1.0); }
                }
                .snake-level-100 {
                    animation: level100 1.2s infinite ease-in-out;
                }
                .snake-level-200 {
                    animation: level200 0.8s infinite ease-in-out;
                }
                .snake-level-300 {
                    animation: level300 0.5s infinite ease-in-out;
                }
                .snake-level-400 {
                    animation: level400 0.6s infinite ease-in-out;
                }
                .snake-level-500 {
                    animation: level500 0.4s infinite linear;
                }
            `}</style>
            {/* Retro Background Grid Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(transparent 95%, #0f0 95%), linear-gradient(90deg, transparent 95%, #0f0 95%)',
                    backgroundSize: '40px 40px'
                }}>
            </div>

            <div className="z-10 text-center mb-4">
                <h1 className="text-4xl text-yellow-400 drop-shadow-[4px_4px_0_#ff00ff] mb-2">SNAKE</h1>
                <div className='flex'>
                    <h1 className="text-xl text-yellow-500 font-bold uppercase tracking-wider animate-pulse">
                        TARGET: {TARGET_SCORE} |
                    </h1>
                    <h1 className="text-xl text-red-500 font-bold uppercase tracking-wider animate-pulse">
                        YOUR BEST: {highScore}
                    </h1>
                </div>

                <div className="flex justify-center gap-6 text-xl mt-1">
                    <p>SCORE: {score}</p>
                    <p className="text-blue-400 font-bold">SPEED: {getSpeedLevel()}</p>
                </div>
            </div>

            <div
                className="relative bg-black border-4 border-green-500 shadow-[10px_10px_0_rgba(0,255,0,0.3)] max-w-[90vw] aspect-square touch-none"
                style={{
                    width: 'min(400px, 90vw)',
                    height: 'min(400px, 90vw)',
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Snake */}
                {snake.map((segment, index) => {
                    const theme = getSnakeStyles();
                    const isHead = index === 0;
                    return (
                        <div
                            key={index}
                            className={`absolute border border-black ${theme.className}`}
                            style={{
                                left: `${(segment.x / GRID_SIZE) * 100}%`,
                                top: `${(segment.y / GRID_SIZE) * 100}%`,
                                width: `${(1 / GRID_SIZE) * 100}%`,
                                height: `${(1 / GRID_SIZE) * 100}%`,
                                borderRadius: isHead ? '4px' : '2px',
                                zIndex: 15 - index,
                                animationDelay: `${index * 60}ms`,
                                transition: isPlaying ? `left ${getGameSpeed()}ms linear, top ${getGameSpeed()}ms linear` : 'none',
                            }}
                        />
                    );
                })}

                {/* Foods */}
                {foods.map((f, index) => {
                    const isBig = f.type === 'big';
                    return (
                        <div
                            key={index}
                            className={`absolute flex items-center justify-center select-none border border-black animate-pulse ${foods.length > 1 ? 'bg-yellow-400' : 'bg-red-500'
                                }`}
                            style={{
                                left: `${(f.x / GRID_SIZE) * 100}%`,
                                top: `${(f.y / GRID_SIZE) * 100}%`,
                                width: `${(1 / GRID_SIZE) * 100}%`,
                                height: `${(1 / GRID_SIZE) * 100}%`,
                                zIndex: 10,
                            }}
                        />
                    );
                })}

                {/* Game Over / Start Screen Overlay */}
                {(!isPlaying || gameOver) && (
                    <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center text-center p-4">
                        {gameOver ? (
                            score >= 300 ? <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ໂຫດໂພດ</h2>
                                : score >= 200 ? <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ໄດ້ເລື່ອງ</h2>
                                    : score >= 100 ? <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ກະພໍໄດ້</h2>
                                        : <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ກາກ</h2>
                        ) : (
                            <h2 className="text-green-500 text-3xl mb-4 animate-pulse">Ready ?</h2>
                        )}


                        {/* User Status & Login Prompt */}
                        {gameOver && !currentUser && score > 0 && (
                            <div className="mb-6 p-4 border-4 border-yellow-500 bg-red-900/70 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                                <p className="text-yellow-300 text-sm font-bold uppercase tracking-widest mb-3 animate-pulse">
                                    ⚠️ LOGIN TO SAVE YOUR SCORE ⚠️
                                </p>
                                <p className="text-yellow-200 text-xs mb-4">
                                    Create an account to save your high score and compete on the leaderboard!
                                </p>
                                <button
                                    onClick={onShowLogin}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-bold py-3 px-4 border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 uppercase font-retro transition-all rounded animate-pulse"
                                >
                                    🔓 LOGIN / REGISTER NOW
                                </button>
                            </div>
                        )}

                        {/* Leaderboard Input Form - Only for logged in users */}
                        {/* {gameOver && currentUser && score > 0 && !submitted && (
                            <div className="mb-6 space-y-3 z-30 p-4 border-2 border-green-500 bg-gray-900/90 rounded-lg">
                                <p className="text-green-400 text-sm font-bold uppercase tracking-widest animate-pulse">
                                    ✅ LOGGED IN - NEW HIGH SCORE! Submit:
                                </p>
                                <div className="flex gap-3 justify-center items-center">
                                    <input
                                        type="text"
                                        maxLength="8"
                                        placeholder="PLAYER"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                                        className="bg-black border-2 border-green-600 p-2 text-white font-retro text-center w-32 focus:outline-none focus:border-green-400 rounded"
                                    />
                                    <button
                                        onClick={submitScore}
                                        disabled={submitting}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 uppercase font-retro transition-all rounded"
                                    >
                                        {submitting ? '...' : 'SEND'}
                                    </button>
                                </div>
                            </div>
                        )} */}

                        {/* Leaderboard Table View */}
                        {
                            gameOver && currentUser && (
                                <div className="mb-6">
                                    {score > highScore && (
                                        <div className="mb-4 p-3 border-2 border-yellow-400 bg-yellow-900/70 rounded animate-pulse">
                                            <p className="text-yellow-300 font-bold uppercase text-sm">🎉 NEW PERSONAL RECORD!</p>
                                            <p className="text-yellow-200 text-xs">Previous: {highScore} → New: {score}</p>
                                        </div>
                                    )}
                                    <Leaderboard />
                                </div>
                            )
                        }

                        {/* <Leaderboard /> */}


                        <button
                            onClick={startGame}
                            className="bg-green-600 text-black font-bold py-3 px-6 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 hover:bg-green-500 transition-all uppercase mb-4"
                        >
                            {gameOver ? 'ລອງໃໝ່' : 'ເລີ່ມເກມ'}
                        </button>
                        <div className="text-xs text-gray-400 mt-2">
                            {gameOver ? (
                                <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ຍັງເຫຼືອແຕ່ {Math.max(0, TARGET_SCORE - score)} ຄະແນນ ໜຶ່ງ</h2>
                            ) : (
                                <h2 className="text-green-500 text-3xl mb-4 animate-bounce">ສູ້ສູ້</h2>
                            )
                            }
                        </div>
                    </div>
                )}
            </div>
            {/* 
            <button
                onClick={onBack}
                className="mt-4 text-gray-500 hover:text-white uppercase text-sm z-10 transition-colors duration-200"
            >
                &lt; ກັບຄືນເມນູ
            </button> */}

            {/* Mobile Controls */}
            <div className="mt-8 grid grid-cols-3 gap-8 z-10 pb-28">
                <div></div>
                <button
                    className="w-20 h-14 sm:w-28 sm:h-16 bg-gray-800 border-2 border-green-500 rounded-lg active:bg-green-900 flex items-center justify-center text-xl sm:text-2xl shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1 transition-all"
                    onMouseDown={() => isPlaying && lastDirectionRef.current.y === 0 && updateDirection({ x: 0, y: -1 })}
                    onTouchStart={() => isPlaying && lastDirectionRef.current.y === 0 && updateDirection({ x: 0, y: -1 })}
                >
                    <KeyboardArrowUpIcon fontSize="large" />
                </button>
                <div></div>
                <button
                    className="w-20 h-14 sm:w-28 sm:h-16 bg-gray-800 border-2 border-green-500 rounded-lg active:bg-green-900 flex items-center justify-center text-xl sm:text-2xl shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1 transition-all"
                    onMouseDown={() => isPlaying && lastDirectionRef.current.x === 0 && updateDirection({ x: -1, y: 0 })}
                    onTouchStart={() => isPlaying && lastDirectionRef.current.x === 0 && updateDirection({ x: -1, y: 0 })}
                >
                    <KeyboardArrowLeftIcon fontSize="large" />
                </button>
                <button
                    className="w-20 h-14 sm:w-28 sm:h-16 bg-gray-800 border-2 border-green-500 rounded-lg active:bg-green-900 flex items-center justify-center text-xl sm:text-2xl shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1 transition-all"
                    onMouseDown={() => isPlaying && lastDirectionRef.current.y === 0 && updateDirection({ x: 0, y: 1 })}
                    onTouchStart={() => isPlaying && lastDirectionRef.current.y === 0 && updateDirection({ x: 0, y: 1 })}
                >
                    <KeyboardArrowDownIcon fontSize="large" />
                </button>
                <button
                    className="w-20 h-14 sm:w-28 sm:h-16 bg-gray-800 border-2 border-green-500 rounded-lg active:bg-green-900 flex items-center justify-center text-xl sm:text-2xl shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1 transition-all"
                    onMouseDown={() => isPlaying && lastDirectionRef.current.x === 0 && updateDirection({ x: 1, y: 0 })}
                    onTouchStart={() => isPlaying && lastDirectionRef.current.x === 0 && updateDirection({ x: 1, y: 0 })}
                >
                    <KeyboardArrowRightIcon fontSize="large" />
                </button>
            </div>
        </div>
    );
};
