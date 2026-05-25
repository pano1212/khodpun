import React, { useState } from 'react';

export function LoginForm({ onBack }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { username, password });
        // Add actual login logic here
    };

    return (
        <div className="min-h-screen bg-gray-900 font-retro flex flex-col items-center justify-center text-white relative overflow-hidden">
            {/* Retro Background Grid Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(transparent 95%, #0f0 95%), linear-gradient(90deg, transparent 95%, #0f0 95%)',
                    backgroundSize: '40px 40px'
                }}>
            </div>

            <button
                onClick={onBack}
                className="fixed top-4 left-4 z-[100] bg-gray-800 text-white px-4 py-2 font-retro text-xs border-2 border-white hover:bg-gray-700"
            >
                &lt; MENU
            </button>

            <div className="z-10 w-full max-w-md p-8 border-4 border-blue-500 bg-gray-800 shadow-[8px_8px_0_#000]">
                <h2 className="text-3xl text-center text-yellow-400 mb-8 uppercase tracking-widest drop-shadow-[4px_4px_0_#ff00ff]">
                    Player Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-green-400 text-sm uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-900 border-2 border-green-600 p-3 text-white focus:outline-none focus:border-green-400 font-retro"
                            placeholder="INSERT COIN"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-green-400 text-sm uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border-2 border-green-600 p-3 text-white focus:outline-none focus:border-green-400 font-retro"
                            placeholder="******"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 hover:bg-blue-500 transition-all uppercase shadow-[4px_4px_0_#000] mt-4"
                    >
                        Start Game
                    </button>
                </form>
            </div>
        </div>
    );
}
