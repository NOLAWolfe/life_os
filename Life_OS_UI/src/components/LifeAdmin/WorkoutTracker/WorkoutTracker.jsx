import React, { useState, useEffect } from 'react';
import './WorkoutTracker.css';

const LiabilityModal = ({ onAccept }) => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
        <div className="bg-gray-900 border border-red-500/50 rounded-xl p-6 max-w-sm w-full shadow-2xl shadow-red-900/20">
            <h2 className="text-2xl font-black text-red-500 mb-4 tracking-tighter uppercase">
                ⚠️ Liability Waiver
            </h2>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                By entering the <strong>Titan Protocol</strong>, you acknowledge that physical
                exercise carries risk of injury. You voluntarily assume all risks. Consult a
                physician before starting.
                <br />
                <br />
                <span className="text-xs text-gray-500">
                    Life.io is not responsible for swole-related wardrobe malfunctions.
                </span>
            </p>
            <button
                onClick={onAccept}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg text-lg uppercase tracking-widest transition-all active:scale-95"
            >
                I Accept the Risk
            </button>
        </div>
    </div>
);

const AppleHealthWidget = () => {
    const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected

    const handleConnect = () => {
        setStatus('connecting');
        setTimeout(() => setStatus('connected'), 1500);
    };

    return (
        <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-3 py-1 border border-gray-700">
            <div
                className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}
            ></div>
            {status === 'connected' ? (
                <span className="text-xs font-medium text-green-400">Health Sync Active</span>
            ) : (
                <button
                    onClick={handleConnect}
                    className="text-xs font-bold text-gray-300 hover:text-white"
                >
                    {status === 'connecting' ? 'Linking...' : 'Link Apple Health'}
                </button>
            )}
        </div>
    );
};

const MusicWidget = () => (
    <div className="bg-gradient-to-r from-pink-600 to-purple-700 rounded-xl p-4 flex items-center justify-between shadow-lg mb-6">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black/30 rounded flex items-center justify-center text-xl">
                🎵
            </div>
            <div>
                <p className="text-xs font-bold text-white/80 uppercase tracking-wider">
                    Now Playing
                </p>
                <p className="text-sm font-black text-white">Beast Mode Playlist</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/30">
                ⏮
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/30">
                ⏯
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/30">
                ⏭
            </button>
        </div>
    </div>
);

const WorkoutTracker = () => {
    const [hasWaiver, setHasWaiver] = useState(
        () => localStorage.getItem('titan_waiver') === 'true'
    );
    const [activeSession, setActiveSession] = useState(null); // 'PUSH', 'PULL', 'LEGS', 'CARDIO'
    const [timer, setTimer] = useState(0);
    const [logs, setLogs] = useState([]);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (activeSession) {
            interval = setInterval(() => setTimer((t) => t + 1), 1000);
        } else {
            if (timer !== 0) setTimeout(() => setTimer(0), 0);
        }
        return () => clearInterval(interval);
    }, [activeSession, timer]);

    // Format Timer
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAcceptWaiver = () => {
        localStorage.setItem('titan_waiver', 'true');
        setHasWaiver(true);
    };

    const startSession = (type) => {
        setActiveSession(type);
    };

    const endSession = () => {
        if (confirm('Finish Workout?')) {
            const newLog = {
                id: Date.now(),
                type: activeSession,
                duration: Math.floor(timer / 60),
                date: new Date().toLocaleDateString(),
            };
            setLogs([newLog, ...logs]);
            setActiveSession(null);
        }
    };

    if (!hasWaiver) return <LiabilityModal onAccept={handleAcceptWaiver} />;

    return (
        <div className="max-w-md mx-auto min-h-screen flex flex-col pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pt-2">
                <h2 className="text-2xl font-black italic tracking-tighter text-white">
                    TITAN<span className="text-blue-500">.OS</span>
                </h2>
                <AppleHealthWidget />
            </div>

            {/* Active Session View */}
            {activeSession ? (
                <div className="flex-1 flex flex-col">
                    <MusicWidget />

                    <div className="text-center mb-8">
                        <p className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-1">
                            Current Session
                        </p>
                        <h1 className="text-5xl font-black text-white mb-2">{activeSession}</h1>
                        <div className="text-6xl font-mono text-blue-400 font-bold tracking-tighter mb-4">
                            {formatTime(timer)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col items-center justify-center active:bg-gray-700">
                            <span className="text-3xl mb-2">⚖️</span>
                            <span className="font-bold text-gray-300">Log Set</span>
                        </button>
                        <button className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col items-center justify-center active:bg-gray-700">
                            <span className="text-3xl mb-2">💧</span>
                            <span className="font-bold text-gray-300">Water</span>
                        </button>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={endSession}
                            className="w-full bg-red-600/20 border border-red-500/50 text-red-400 font-bold py-6 rounded-xl text-xl uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors"
                        >
                            End Workout
                        </button>
                    </div>
                </div>
            ) : (
                /* Dashboard View */
                <div className="flex-1">
                    <div className="mb-8">
                        <p className="text-gray-400 text-sm font-medium mb-4">Start a session:</p>
                        <div className="grid grid-cols-2 gap-4">
                            {['PUSH', 'PULL', 'LEGS', 'CARDIO'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => startSession(type)}
                                    className="aspect-square bg-gray-800/80 hover:bg-blue-600/20 hover:border-blue-500 border border-gray-700 rounded-2xl flex flex-col items-center justify-center transition-all group"
                                >
                                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                                        {type === 'PUSH' && '💪'}
                                        {type === 'PULL' && '🧗'}
                                        {type === 'LEGS' && '🦵'}
                                        {type === 'CARDIO' && '🏃'}
                                    </span>
                                    <span className="font-black text-xl text-gray-200 group-hover:text-blue-400">
                                        {type}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {logs.length === 0 && (
                                <p className="text-sm text-gray-600 italic">
                                    No workouts logged yet. Get moving!
                                </p>
                            )}
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex justify-between items-center text-sm border-b border-gray-800/50 pb-2 last:border-0"
                                >
                                    <div>
                                        <span className="font-bold text-white block">
                                            {log.type}
                                        </span>
                                        <span className="text-xs text-gray-500">{log.date}</span>
                                    </div>
                                    <span className="font-mono text-blue-400">{log.duration}m</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutTracker;
