import React, { useState, useEffect } from 'react';
import { auth, db, getUserPointsByAuthUid } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function LoginForm({ onBack }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [userPoints, setUserPoints] = useState(0);
    const [userName, setUserName] = useState('');

    // Check if user is already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                // Fetch user points from Firestore
                try {
                    // Method 1: Query by auth UID if 'uid' field exists in leaderboard
                    const points = await getUserPointsByAuthUid(user.uid);
                    if (points !== null) {
                        setUserPoints(points);
                    } else {
                        // Method 2: Try to get user document by UID directly
                        const userRef = doc(db, 'leaderboard', user.uid);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            setUserPoints(userSnap.data().score || 0);
                            setUserName(userSnap.data().name || user.email);
                        }
                    }
                } catch (err) {
                    console.error('Error fetching user points:', err);
                }
            } else {
                setCurrentUser(null);
                setUserPoints(0);
                setUserName('');
            }
        });
        return unsubscribe;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.message);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.message);
        }
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

            {/* User Profile - Shows when logged in */}
            {currentUser ? (
                <div className="z-10 w-full max-w-md p-8 border-4 border-green-500 bg-gray-800 shadow-[8px_8px_0_#000]">
                    <h2 className="text-3xl text-center text-yellow-400 mb-8 uppercase tracking-widest drop-shadow-[4px_4px_0_#00ff00]">
                        ✓ LOGGED IN
                    </h2>

                    <div className="space-y-6 text-center">
                        <div className="border-2 border-green-600 bg-gray-900 p-4">
                            <p className="text-green-400 text-xs uppercase tracking-wider mb-2">PLAYER</p>
                            <p className="text-yellow-400 text-xl font-bold">{userName || currentUser.email}</p>
                        </div>

                        <div className="border-2 border-yellow-500 bg-gray-900 p-4">
                            <p className="text-yellow-400 text-xs uppercase tracking-wider mb-2">CURRENT POINTS</p>
                            <p className="text-white text-3xl font-bold">{userPoints}</p>
                        </div>

                        <div className="border-2 border-cyan-500 bg-gray-900 p-3">
                            <p className="text-cyan-400 text-xs uppercase tracking-wider">EMAIL</p>
                            <p className="text-white text-sm">{currentUser.email}</p>
                        </div>

                        {error && (
                            <div className="border-2 border-red-500 bg-gray-900 p-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 text-white font-bold py-4 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 hover:bg-red-500 transition-all uppercase shadow-[4px_4px_0_#000]"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                /* Login Form - Shows when not logged in */
                <div className="z-10 w-full max-w-md p-8 border-4 border-blue-500 bg-gray-800 shadow-[8px_8px_0_#000]">
                    <h2 className="text-3xl text-center text-yellow-400 mb-8 uppercase tracking-widest drop-shadow-[4px_4px_0_#ff00ff]">
                        Player Login
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-green-400 text-sm uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-900 border-2 border-green-600 p-3 text-white focus:outline-none focus:border-green-400 font-retro"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-green-400 text-sm uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900 border-2 border-green-600 p-3 text-white focus:outline-none focus:border-green-400 font-retro"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="border-2 border-red-500 bg-gray-900 p-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-4 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 hover:bg-blue-500 transition-all uppercase shadow-[4px_4px_0_#000] mt-4 disabled:opacity-50"
                        >
                            {loading ? 'LOGGING IN...' : 'START GAME'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
