import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameLog, MoveEntry, Player, GameMode } from '../types';

interface GameHistoryContextType {
    logs: GameLog[];
    addLog: (mode: GameMode, winner: Player | null, isDraw: boolean, moves: MoveEntry[]) => void;
    clearLogs: () => void;
}

const GameHistoryContext = createContext<GameHistoryContextType>({
    logs: [],
    addLog: () => {},
    clearLogs: () => {},
});

export function GameHistoryProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const [logs, setLogs] = useState<GameLog[]>([]);

    const addLog = useCallback((mode: GameMode, winner: Player | null, isDraw: boolean, moves: MoveEntry[]) => {
        const newLog: GameLog = {
            id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            mode,
            winner,
            isDraw,
            moves,
            date: new Date().toISOString(),
        };
        setLogs(prev => [newLog, ...prev]);
    }, []);

    const clearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    return (
        <GameHistoryContext.Provider value={{ logs, addLog, clearLogs }}>
            {children}
        </GameHistoryContext.Provider>
    );
}

export function useGameHistory(): GameHistoryContextType {
    return useContext(GameHistoryContext);
}
