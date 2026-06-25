import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';

export const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, 'leaderboard'),
            orderBy('score', 'desc'),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const scores = [];
            snapshot.forEach((doc) => {
                scores.push({ id: doc.id, ...doc.data() });
            });
            setLeaderboard(scores);
            if (scores.length > 0) {
                setHighScore(scores[0].score);
            }
        }, (error) => {
            console.error("Error fetching leaderboard:", error);
        });

        return () => unsubscribe();
    }, []);
    return (
        <div>
            {leaderboard.length > 0 && (
                <div className="mb-6 w-72 p-3 border-2 border-purple-500 bg-gray-900/95 text-left rounded shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <h3 className="text-purple-400 text-center font-bold uppercase tracking-widest text-xs mb-2 border-b border-purple-800 pb-1">
                        🏆 Global Leaders
                    </h3>
                    <div className="space-y-1 text-[11px] tracking-wider uppercase font-retro">
                        {leaderboard.map((entry, index) => (
                            <div key={entry.id} className="flex justify-between text-yellow-400">
                                <span>{index + 1}. {entry.name || 'GUEST'}</span>
                                <span className="text-white font-bold">{entry.score}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
