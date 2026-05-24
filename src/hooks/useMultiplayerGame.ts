import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Board, Player, CellValue, Scores } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

const EMPTY_BOARD: Board = [null, null, null, null, null, null, null, null, null];

const WINNING_COMBINATIONS: readonly number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Board): Player | null {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
        const cellA: CellValue = board[a];
        if (cellA !== null && cellA === board[b] && cellA === board[c]) {
            return cellA;
        }
    }
    return null;
}

function checkDraw(board: Board, winner: Player | null): boolean {
    return board.every(cell => cell !== null) && winner === null;
}

function generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function generatePlayerId(): string {
    return Math.random().toString(36).substring(2, 15);
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'waiting' | 'playing' | 'error';

export interface MultiplayerState {
    board: Board;
    currentPlayer: Player;
    winner: Player | null;
    isDraw: boolean;
    gameOver: boolean;
    myPlayer: Player | null;
    roomCode: string | null;
    status: ConnectionStatus;
    statusMessage: string;
    scores: Scores;
    errorMessage: string | null;
}

export interface MultiplayerActions {
    state: MultiplayerState;
    createRoom: () => Promise<void>;
    joinRoom: (code: string) => Promise<void>;
    handlePress: (index: number) => void;
    resetGame: () => void;
    leaveRoom: () => void;
}

export function useMultiplayerGame(): MultiplayerActions {
    const [board, setBoard] = useState<Board>(EMPTY_BOARD);
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [myPlayer, setMyPlayer] = useState<Player | null>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [scores, setScores] = useState<Scores>({ X: 0, O: 0, draws: 0 });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const channelRef = useRef<RealtimeChannel | null>(null);
    const playerIdRef = useRef<string>(generatePlayerId());
    const roomIdRef = useRef<string | null>(null);

    // Clean up subscription on unmount
    useEffect(() => {
        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, []);

    const subscribeToRoom = useCallback((roomId: string) => {
        // Remove existing channel if any
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
        }

        const channel = supabase
            .channel(`room:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'game_rooms',
                    filter: `id=eq.${roomId}`,
                },
                (payload) => {
                    const data = payload.new as any;
                    const newBoard = data.board as Board;
                    const newWinner = checkWinner(newBoard);
                    const newIsDraw = checkDraw(newBoard, newWinner);

                    setBoard(newBoard);
                    setCurrentPlayer(data.current_player as Player);
                    setWinner(newWinner);
                    setIsDraw(newIsDraw);
                    setGameOver(data.game_over);

                    if (data.status === 'playing') {
                        setStatus('playing');
                    }

                    if (newWinner) {
                        setScores(s => ({ ...s, [newWinner]: s[newWinner as 'X' | 'O'] + 1 }));
                    } else if (newIsDraw) {
                        setScores(s => ({ ...s, draws: s.draws + 1 }));
                    }
                }
            )
            .subscribe();

        channelRef.current = channel;
    }, []);

    const createRoom = useCallback(async () => {
        setStatus('connecting');
        setErrorMessage(null);

        const code = generateRoomCode();
        const playerId = playerIdRef.current;

        const { data, error } = await supabase
            .from('game_rooms')
            .insert({
                room_code: code,
                player_x: playerId,
                status: 'waiting',
            })
            .select()
            .single();

        if (error) {
            setStatus('error');
            setErrorMessage('Failed to create room. Try again.');
            return;
        }

        roomIdRef.current = data.id;
        setRoomCode(code);
        setMyPlayer('X');
        setStatus('waiting');
        setBoard(EMPTY_BOARD);
        setCurrentPlayer('X');
        setWinner(null);
        setIsDraw(false);
        setGameOver(false);

        subscribeToRoom(data.id);
    }, [subscribeToRoom]);

    const joinRoom = useCallback(async (code: string) => {
        setStatus('connecting');
        setErrorMessage(null);

        const upperCode = code.toUpperCase().trim();

        // Find the room
        const { data: room, error: findError } = await supabase
            .from('game_rooms')
            .select()
            .eq('room_code', upperCode)
            .eq('status', 'waiting')
            .single();

        if (findError || !room) {
            setStatus('error');
            setErrorMessage('Room not found or already full.');
            return;
        }

        const playerId = playerIdRef.current;

        // Join as player O
        const { error: updateError } = await supabase
            .from('game_rooms')
            .update({
                player_o: playerId,
                status: 'playing',
            })
            .eq('id', room.id);

        if (updateError) {
            setStatus('error');
            setErrorMessage('Failed to join room. Try again.');
            return;
        }

        roomIdRef.current = room.id;
        setRoomCode(upperCode);
        setMyPlayer('O');
        setStatus('playing');
        setBoard(room.board as Board);
        setCurrentPlayer(room.current_player as Player);
        setWinner(null);
        setIsDraw(false);
        setGameOver(false);

        subscribeToRoom(room.id);
    }, [subscribeToRoom]);

    const handlePress = useCallback(async (index: number) => {
        // Only allow moves on your turn
        if (gameOver || board[index] !== null || currentPlayer !== myPlayer || !roomIdRef.current) {
            return;
        }

        const newBoard = [...board] as Board;
        newBoard[index] = currentPlayer;

        const newWinner = checkWinner(newBoard);
        const newIsDraw = checkDraw(newBoard, newWinner);
        const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
        const newGameOver = newWinner !== null || newIsDraw;

        // Optimistic update
        setBoard(newBoard);
        setCurrentPlayer(nextPlayer);

        if (newWinner) {
            setWinner(newWinner);
            setGameOver(true);
            setScores(s => ({ ...s, [newWinner]: s[newWinner as 'X' | 'O'] + 1 }));
        } else if (newIsDraw) {
            setIsDraw(true);
            setGameOver(true);
            setScores(s => ({ ...s, draws: s.draws + 1 }));
        }

        // Push to Supabase
        await supabase
            .from('game_rooms')
            .update({
                board: newBoard,
                current_player: nextPlayer,
                winner: newWinner,
                is_draw: newIsDraw,
                game_over: newGameOver,
                status: newGameOver ? 'finished' : 'playing',
                updated_at: new Date().toISOString(),
            })
            .eq('id', roomIdRef.current);
    }, [board, currentPlayer, gameOver, myPlayer]);

    const resetGame = useCallback(async () => {
        if (!roomIdRef.current) return;

        const newBoard = EMPTY_BOARD;

        setBoard(newBoard);
        setCurrentPlayer('X');
        setWinner(null);
        setIsDraw(false);
        setGameOver(false);

        await supabase
            .from('game_rooms')
            .update({
                board: newBoard,
                current_player: 'X',
                winner: null,
                is_draw: false,
                game_over: false,
                status: 'playing',
                updated_at: new Date().toISOString(),
            })
            .eq('id', roomIdRef.current);
    }, []);

    const leaveRoom = useCallback(() => {
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
            channelRef.current = null;
        }

        roomIdRef.current = null;
        setRoomCode(null);
        setMyPlayer(null);
        setStatus('disconnected');
        setBoard(EMPTY_BOARD);
        setCurrentPlayer('X');
        setWinner(null);
        setIsDraw(false);
        setGameOver(false);
        setScores({ X: 0, O: 0, draws: 0 });
        setErrorMessage(null);
    }, []);

    const statusMessage = (() => {
        if (winner) return `Player ${winner} Wins!`;
        if (isDraw) return "It's a Draw!";
        if (status === 'waiting') return 'Waiting for opponent...';
        if (status === 'connecting') return 'Connecting...';
        if (currentPlayer === myPlayer) return "Your Turn";
        return "Opponent's Turn";
    })();

    return {
        state: {
            board,
            currentPlayer,
            winner,
            isDraw,
            gameOver,
            myPlayer,
            roomCode,
            status,
            statusMessage,
            scores,
            errorMessage,
        },
        createRoom,
        joinRoom,
        handlePress,
        resetGame,
        leaveRoom,
    };
}
