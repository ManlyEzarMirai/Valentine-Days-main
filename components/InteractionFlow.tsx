'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Circle } from 'lucide-react';

// --- Background Particles ---
const BackgroundHearts = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        y: '110vh',
                        x: `${(i * 10) + Math.random() * 5}%`,
                        scale: 0.5
                    }}
                    animate={{
                        opacity: [0, 0.2, 0],
                        y: '-10vh',
                        rotate: [0, 180],
                        scale: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "linear"
                    }}
                    className="absolute"
                >
                    <div className="w-[30px] h-[30px] bg-red-500/20 rounded-full" />
                </motion.div>
            ))}
        </div>
    );
};

// --- Step 1: Mode ---
const LoveModeStep = ({ onComplete }: { onComplete: () => void }) => {
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        if (isOn) {
            const timer = setTimeout(() => onComplete(), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOn, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            className="flex flex-col items-center justify-center relative z-10"
        >
            <div className={`backdrop-blur-2xl p-12 rounded-[3rem] transition-all duration-1000 flex flex-col items-center space-y-10 border border-white/10 ${isOn ? 'bg-red-500/10 shadow-[0_0_80px_rgba(239,68,68,0.2)] border-red-500/20' : 'bg-white/5 shadow-2xl'}`}>

                <motion.div
                    animate={isOn ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className={`w-24 h-24 rounded-full transition-all duration-1000 ${isOn ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]' : 'bg-white/10'}`} />
                </motion.div>

                <span className={`text-5xl font-playfair transition-colors duration-1000 ${isOn ? 'text-white' : 'text-white/40'}`}>
                    game mode
                </span>

                <button
                    onClick={() => setIsOn(!isOn)}
                    className={`relative w-32 h-16 rounded-full transition-all duration-700 p-1.5 ${isOn ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-white/10'}`}
                >
                    <motion.div
                        animate={{ x: isOn ? 64 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="w-13 h-13 bg-white rounded-full shadow flex items-center justify-center"
                    >
                        <div className={`w-6 h-6 rounded-full ${isOn ? "bg-red-500" : "bg-gray-300"}`} />
                    </motion.div>
                </button>
            </div>
        </motion.div>
    );
};

// --- Step 2: TicTacToe ---
const TicTacToeStep = ({ onComplete }: { onComplete: () => void }) => {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [isUserTurn, setIsUserTurn] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [message, setMessage] = useState("Let's play a little game...");

    const checkWinner = useCallback((squares: (string | null)[]) => {
        const lines = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        for (const [a,b,c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return squares.includes(null) ? null : 'draw';
    }, []);

    const handleSquareClick = (i: number) => {
        if (board[i] || winner || !isUserTurn) return;
        const newBoard = [...board];
        newBoard[i] = 'X';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) setWinner(result);
        else {
            setIsUserTurn(false);
            setTimeout(() => {
                const empty = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
                if (!empty.length) return;
                const idx = empty[Math.floor(Math.random() * empty.length)];
                newBoard[idx] = 'O';
                setBoard([...newBoard]);
                const r = checkWinner(newBoard);
                if (r) setWinner(r);
                else setIsUserTurn(true);
            }, 600);
        }
    };

    useEffect(() => {
        if (winner === 'X') {
            setMessage("Yeyy, oke kamu menang!");
            setTimeout(() => onComplete(), 3500);
        } else if (winner === 'O' || winner === 'draw') {
            setTimeout(() => {
                setBoard(Array(9).fill(null));
                setWinner(null);
                setIsUserTurn(true);
            }, 1500);
        }
    }, [winner, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-10"
        >
            <h2 className="text-4xl text-white text-center">
                {message}
            </h2>

            <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-3xl border border-white/10">
                {board.map((sq, i) => (
                    <button
                        key={i}
                        onClick={() => handleSquareClick(i)}
                        className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center"
                    >
                        {sq === 'X' && <X className="w-12 h-12 text-white/80" />}
                        {sq === 'O' && <Circle className="w-12 h-12 text-pink-300 opacity-50" />}
                    </button>
                ))}
            </div>

            {winner === 'X' && (
                <h2 className="text-4xl text-white mt-4">Menang!</h2>
            )}
        </motion.div>
    );
};

// --- Step 3: Meter ---
const LoveMeterStep = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onComplete(), 1500);
                    return 100;
                }
                return p + 1;
            });
        }, 40);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-12"
        >
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)]"
            />

            <div className="text-6xl font-black text-white">
                {progress}%
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                    animate={{ width: `${progress}%` }}
                />
            </div>
        </motion.div>
    );
};

// --- Flow Controller ---
export default function InteractionFlow({ onFlowComplete }: { onFlowComplete: () => void }) {
    const [step, setStep] = useState(1);

    return (
        <div className="fixed inset-0 bg-[#060010] flex items-center justify-center overflow-hidden">
            <BackgroundHearts />
            <AnimatePresence mode="wait">
                {step === 1 && <LoveModeStep key="1" onComplete={() => setStep(2)} />}
                {step === 2 && <TicTacToeStep key="2" onComplete={() => setStep(3)} />}
                {step === 3 && <LoveMeterStep key="3" onComplete={() => onFlowComplete()} />}
            </AnimatePresence>
        </div>
    );
}