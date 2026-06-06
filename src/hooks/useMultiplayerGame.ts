import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Board, Player, CellValue, Scores, MoveEntry } from '../types';
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

export function useMultiplayerGame(onGameEnd?: (winner: Player | null, isDraw: boolean, moves: MoveEntry[]) => void): MultiplayerActions {
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
    // Tracks who goes first — alternates each game
    const [firstPlayer, setFirstPlayer] = useState<Player>('X');
    // Move log for history
    const [moveLog, setMoveLog] = useState<MoveEntry[]>([]);
    const gameEndedRef = useRef(false);

    const channelRef = useRef<RealtimeChannel | null>(null);
    const playerIdRef = useRef<string>(generatePlayerId());
    const roomIdRef = useRef<string | null>(null);
    const moveLogRef = useRef<MoveEntry[]>([]);

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
                    const oldData = payload.old as any;
                    const newBoard = data.board as Board;
                    const newWinner = checkWinner(newBoard);
                    const newIsDraw = checkDraw(newBoard, newWinner);

                    // Detect opponent's move by comparing boards
                    const prevBoard = oldData?.board as Board | undefined;
                    if (prevBoard && newBoard) {
                        for (let i = 0; i < 9; i++) {
                            if (prevBoard[i] === null && newBoard[i] !== null) {
                                const move: MoveEntry = {
                                    player: newBoard[i] as Player,
                                    position: i,
                                    moveNumber: moveLogRef.current.length + 1,
                                };
                                moveLogRef.current = [...moveLogRef.current, move];
                                setMoveLog(moveLogRef.current);
                                break;
                            }
                        }
                    }

                    setBoard(newBoard);
                    setCurrentPlayer(data.current_player as Player);
                    setWinner(newWinner);
                    setIsDraw(newIsDraw);
                    setGameOver(data.game_over);

                    // If the board was reset, sync the first player and clear move log
                    if (newBoard.every(cell => cell === null) && !data.game_over) {
                        setFirstPlayer(data.current_player as Player);
                        setMoveLog([]);
                        moveLogRef.current = [];
                        gameEndedRef.current = false;
                    }

                    if (data.status === 'playing') {
                        setStatus('playing');
                    }

                    if (newWinner) {
                        setScores(s => ({ ...s, [newWinner]: s[newWinner as 'X' | 'O'] + 1 }));
                        if (!gameEndedRef.current) {
                            gameEndedRef.current = true;
                            onGameEnd?.(newWinner, false, moveLogRef.current);
                        }
                    } else if (newIsDraw) {
                        setScores(s => ({ ...s, draws: s.draws + 1 }));
                        if (!gameEndedRef.current) {
                            gameEndedRef.current = true;
                            onGameEnd?.(null, true, moveLogRef.current);
                        }
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
            const detail = error.message || error.code || 'Unknown error';
            setErrorMessage(`Failed to create room: ${detail}`);
            console.error('Create room error:', error);
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

        // Track the move
        const newMoveLog = [...moveLog, { player: currentPlayer, position: index, moveNumber: moveLog.length + 1 } as MoveEntry];
        setMoveLog(newMoveLog);
        moveLogRef.current = newMoveLog;

        // Optimistic update
        setBoard(newBoard);
        setCurrentPlayer(nextPlayer);

        if (newWinner) {
            setWinner(newWinner);
            setGameOver(true);
            setScores(s => ({ ...s, [newWinner]: s[newWinner as 'X' | 'O'] + 1 }));
            if (!gameEndedRef.current) {
                gameEndedRef.current = true;
                onGameEnd?.(newWinner, false, newMoveLog);
            }
        } else if (newIsDraw) {
            setIsDraw(true);
            setGameOver(true);
            setScores(s => ({ ...s, draws: s.draws + 1 }));
            if (!gameEndedRef.current) {
                gameEndedRef.current = true;
                onGameEnd?.(null, true, newMoveLog);
            }
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
    }, [board, currentPlayer, gameOver, myPlayer, moveLog, onGameEnd]);

    const resetGame = useCallback(async () => {
        if (!roomIdRef.current) return;

        const newBoard = EMPTY_BOARD;
        // Alternate who goes first
        const nextFirstPlayer: Player = firstPlayer === 'X' ? 'O' : 'X';

        setBoard(newBoard);
        setCurrentPlayer(nextFirstPlayer);
        setFirstPlayer(nextFirstPlayer);
        setWinner(null);
        setIsDraw(false);
        setGameOver(false);
        setMoveLog([]);
        moveLogRef.current = [];
        gameEndedRef.current = false;

        await supabase
            .from('game_rooms')
            .update({
                board: newBoard,
                current_player: nextFirstPlayer,
                winner: null,
                is_draw: false,
                game_over: false,
                status: 'playing',
                updated_at: new Date().toISOString(),
            })
            .eq('id', roomIdRef.current);
    }, [firstPlayer]);

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
