import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

export const SnakeGame = ({ onBack }) => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [foods, setFoods] = useState([{ x: 15, y: 15, type: 'normal', points: 10 }]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [deathReason, setDeathReason] = useState(''); // 'wall' or 'self'
    const gameLoopRef = useRef();
    const lastDirectionRef = useRef(INITIAL_DIRECTION);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying) return;

            const lastDir = lastDirectionRef.current;

            switch (e.key) {
                case 'ArrowUp':
                    if (lastDir.y === 0) setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    if (lastDir.y === 0) setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    if (lastDir.x === 0) setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    if (lastDir.x === 0) setDirection({ x: 1, y: 0 });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]);

    const getGameSpeed = () => {
        if (score >= 500) return 50;
        if (score >= 400) return 70;
        if (score >= 300) return 90;
        if (score >= 200) return 110;
        if (score >= 100) return 130;
        return 150;
    };

    const getSpeedLevel = () => {
        if (score >= 500) return 'MAX (5x)';
        if (score >= 400) return 'LEVEL 5 (4x)';
        if (score >= 300) return 'LEVEL 4 (3x)';
        if (score >= 200) return 'LEVEL 3 (2x)';
        if (score >= 100) return 'LEVEL 2 (1.5x)';
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
    }, [snake, direction, isPlaying, gameOver, score, foods]);

    const moveSnake = () => {
        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y,
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

        // Check collision with self (excluding the tail segment if we aren't eating)
        const isEating = foods.some((f) => f.x === newHead.x && f.y === newHead.y);
        const segmentsToCollisionCheck = isEating ? snake : snake.slice(0, -1);

        if (segmentsToCollisionCheck.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
            setGameOver(true);
            setIsPlaying(false);
            setDeathReason('self');
            return;
        }

        // Save last moved direction
        lastDirectionRef.current = direction;

        const newSnake = [newHead, ...snake];

        // Check collision with any food
        const eatenFoodIndex = foods.findIndex(
            (f) => f.x === newHead.x && f.y === newHead.y
        );

        if (eatenFoodIndex !== -1) {
            const eatenFood = foods[eatenFoodIndex];
            const newScore = score + eatenFood.points;
            setScore(newScore);
            generateFoods(newSnake, newScore);
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
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
            // First food: normal size, label 'x5', worth 5 points
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
                points: -30,
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

        setFoods(generatedFoods);
    };

    const startGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        lastDirectionRef.current = INITIAL_DIRECTION;
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        setDeathReason('');
        generateFoods(INITIAL_SNAKE, 0);
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
                    if (lastDir.x === 0) setDirection({ x: 1, y: 0 });
                } else {
                    if (lastDir.x === 0) setDirection({ x: -1, y: 0 });
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > threshold) {
                if (diffY > 0) {
                    if (lastDir.y === 0) setDirection({ x: 0, y: 1 });
                } else {
                    if (lastDir.y === 0) setDirection({ x: 0, y: -1 });
                }
            }
        }
    };

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
                <p className="text-xl text-red-500">Hight score: 500</p>
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
                            score >= 80 ? <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ໂຫດໂພດ</h2>
                                : score >= 50 ? <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ໄດ້ເລື່ອງ</h2>
                                    : score >= 30 ? <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ກະພໍໄດ້</h2>
                                        : <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ກາກ</h2>
                        ) : (
                            <h2 className="text-green-500 text-3xl mb-4 animate-pulse">Ready ?</h2>
                        )}
                        {gameOver && (
                            <h3 className="text-yellow-400 text-sm mb-4 font-bold select-none uppercase tracking-wide">
                                {deathReason === 'wall' ? '❌ ຕຳກຳແພງ (Hit the wall)' : '❌ ຕຳຕົນເອງ (Hit your tail)'}
                            </h3>
                        )}
                        <button
                            onClick={startGame}
                            className="bg-green-600 text-black font-bold py-3 px-6 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 hover:bg-green-500 transition-all uppercase mb-4"
                        >
                            {gameOver ? 'ລອງໃໝ່' : 'ເລີ່ມເກມ'}
                        </button>
                        <div className="text-xs text-gray-400 mt-2">
                            {gameOver ? (
                                <h2 className="text-red-500 text-3xl mb-4 animate-bounce">ຍັງເຫຼືອແຕ່ {500 - score} ຄະແນນ ໜຶ່ງ</h2>
                            ) : (
                                <h2 className="text-green-500 text-3xl mb-4 animate-bounce">ສູ້ສູ້</h2>
                            )
                            }
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={onBack}
                className="mt-4 text-gray-500 hover:text-white uppercase text-sm z-10 transition-colors duration-200"
            >
                &lt; ກັບຄືນເມນູ
            </button>

            {/* Mobile Controls */}
            <div className="mt-8 grid grid-cols-3 gap-8 z-10 pb-28">
                <div></div>
                <button
                    className="w-20 h-14 sm:w-28 sm:h-16 bg-gray-800 border-2 border-green-500 rounded-lg active:bg-green-900 flex items-center justify-center text-xl sm:text-2xl shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1"
                    onClick={() => isPlaying && lastDirectionRef.current.y === 0 && setDirection({ x: 0, y: -1 })}
                >
                    <KeyboardArrowUpIcon fontSize="large" />
                </button>
                <div></div>
                <button
                    className="w-20 h-14 sm:w-28 sm:h-16 bg-gray-800 border-2 border-green-500 rounded-lg active:bg-green-900 flex items-center justify-center text-xl sm:text-2xl shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1"
                    onClick={() => isPlaying && lastDirectionRef.current.x === 0 && setDirection({ x: -1, y: 0 })}
                >
                    <KeyboardArrowLeftIcon fontSize="large" />
                </button>
                <button
                    className="w-20 h-14 sm:w-28 sm:h-16 bg-gray-800 border-2 border-green-500 rounded-lg active:bg-green-900 flex items-center justify-center text-xl sm:text-2xl shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1"
                    onClick={() => isPlaying && lastDirectionRef.current.y === 0 && setDirection({ x: 0, y: 1 })}
                >
                    <KeyboardArrowDownIcon fontSize="large" />
                </button>
                <button
                    className="w-20 h-14 sm:w-28 sm:h-16 bg-gray-800 border-2 border-green-500 rounded-lg active:bg-green-900 flex items-center justify-center text-xl sm:text-2xl shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1"
                    onClick={() => isPlaying && lastDirectionRef.current.x === 0 && setDirection({ x: 1, y: 0 })}
                >
                    <KeyboardArrowRightIcon fontSize="large" />
                </button>
            </div>
        </div>
    );
};
