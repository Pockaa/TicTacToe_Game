import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Board, GameState, GameActions, Player, CellValue, Scores, MoveEntry, GameMode } from '../types';

const WINNING_COMBINATIONS: readonly number[][] = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal: top-left to bottom-right
    [2, 4, 6], // Diagonal: top-right to bottom-left
];

const EMPTY_BOARD: Board = [
    null, null, null,
    null, null, null,
    null, null, null,
];

const INITIAL_STATE: GameState = {
    board: EMPTY_BOARD,
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    gameOver: false,
    moveCount: 0,
};


function checkWinner(board: Board): Player | null {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
        const cellA: CellValue = board[a];

        if (cellA !== null && cellA === board[b] && cellA === board[c]) {
            return cellA;
        }
    }
    return null;
}

function checkDraw(moveCount: number, winner: Player | null): boolean {
    return moveCount === 9 && winner === null;
}

interface UseGameLogicOptions {
    mode?: GameMode;
    onGameEnd?: (winner: Player | null, isDraw: boolean, moves: MoveEntry[]) => void;
}

export function useGameLogic(options?: UseGameLogicOptions): GameActions {
    const mode = options?.mode ?? 'local';
    const onGameEnd = options?.onGameEnd;

    const [scores, setScores] = useState<Scores>({ X: 0, O: 0, draws: 0 });
    const [history, setHistory] = useState<Board[]>([EMPTY_BOARD]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isSinglePlayer, setIsSinglePlayer] = useState<boolean>(mode === 'ai');
    const [moveLog, setMoveLog] = useState<MoveEntry[]>([]);
    const gameEndedRef = useRef(false);
    
    // First game always starts with X, then alternates each reset
    const [startingPlayer, setStartingPlayer] = useState<Player>('X');

    const currentBoard = history[currentStep];
    const moveCount = currentStep;
    
    const currentPlayer: Player = currentStep % 2 === 0 
        ? startingPlayer 
        : (startingPlayer === 'X' ? 'O' : 'X');
        
    const winner: Player | null = checkWinner(currentBoard);
    const isDraw: boolean = checkDraw(moveCount, winner);
    const gameOver: boolean = winner !== null || isDraw;

    const gameState: GameState = {
        board: currentBoard,
        currentPlayer,
        winner,
        isDraw,
        gameOver,
        moveCount,
    };

    // Log game when it ends
    useEffect(() => {
        if (gameOver && !gameEndedRef.current && moveLog.length > 0) {
            gameEndedRef.current = true;
            onGameEnd?.(winner, isDraw, moveLog);
        }
    }, [gameOver, winner, isDraw, moveLog, onGameEnd]);

    const handlePress = useCallback(
        (index: number): void => {
            if (gameOver || currentBoard[index] !== null) {
                return;
            }

            // Also prevent user from clicking during AI turn.
            if (isSinglePlayer && currentPlayer === 'O') {
                return; // Wait for AI
            }

            const newBoard: Board = [...currentBoard] as Board;
            newBoard[index] = currentPlayer;

            const newHistory = [...history.slice(0, currentStep + 1), newBoard];
            setHistory(newHistory);
            setCurrentStep(newHistory.length - 1);

            // Track the move
            setMoveLog(prev => [...prev, { player: currentPlayer, position: index, moveNumber: prev.length + 1 }]);

            const newWinner = checkWinner(newBoard);
            const newIsDraw = checkDraw(newHistory.length - 1, newWinner);

            if (newWinner) {
                setScores(s => ({ ...s, [newWinner as keyof Scores]: s[newWinner as keyof Scores] + 1 }));
            } else if (newIsDraw) {
                setScores(s => ({ ...s, draws: s.draws + 1 }));
            }
        },
        [gameOver, currentBoard, currentPlayer, isSinglePlayer, history, currentStep]
    );

    const makeAiMove = useCallback((aiMove: number) => {
        const newBoard: Board = [...currentBoard] as Board;
        newBoard[aiMove] = 'O';

        const newHistory = [...history.slice(0, currentStep + 1), newBoard];
        setHistory(newHistory);
        setCurrentStep(newHistory.length - 1);

        // Track AI move
        setMoveLog(prev => [...prev, { player: 'O', position: aiMove, moveNumber: prev.length + 1 }]);

        const newWinner = checkWinner(newBoard);
        const newIsDraw = checkDraw(newHistory.length - 1, newWinner);

        if (newWinner) {
            setScores(s => ({ ...s, [newWinner as keyof Scores]: s[newWinner as keyof Scores] + 1 }));
        } else if (newIsDraw) {
            setScores(s => ({ ...s, draws: s.draws + 1 }));
        }
    }, [currentBoard, history, currentStep]);

    useEffect(() => {
        if (isSinglePlayer && currentPlayer === 'O' && !gameOver) {
            const timer = setTimeout(() => {
                const aiMove = getBestMove(currentBoard, 'O');
                if (aiMove !== -1) {
                    makeAiMove(aiMove);
                }
            }, 600); // 600ms thinking time
            return () => clearTimeout(timer);
        }
    }, [isSinglePlayer, currentPlayer, gameOver, currentBoard, makeAiMove]);

    const resetGame = useCallback((): void => {
        setHistory([EMPTY_BOARD]);
        setCurrentStep(0);
        setStartingPlayer(prev => prev === 'X' ? 'O' : 'X');
        setMoveLog([]);
        gameEndedRef.current = false;
    }, []);

    const undo = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(step => Math.max(0, step - (isSinglePlayer ? 2 : 1)));
        }
    }, [currentStep, isSinglePlayer]);

    const redo = useCallback(() => {
        if (currentStep < history.length - 1) {
            setCurrentStep(step => Math.min(history.length - 1, step + (isSinglePlayer ? 2 : 1)));
        }
    }, [currentStep, history.length, isSinglePlayer]);

    const toggleSinglePlayer = useCallback(() => {
        setIsSinglePlayer(prev => !prev);
        setHistory([EMPTY_BOARD]);
        setCurrentStep(0);
        setScores({ X: 0, O: 0, draws: 0 });
        setStartingPlayer('X');
        setMoveLog([]);
        gameEndedRef.current = false;
    }, []);

    const statusMessage: string = useMemo((): string => {
        // In single-player, the AI is always 'O' and the human is 'X'.
        if (winner) {
            if (isSinglePlayer) {
                return winner === 'O' ? 'AI Wins!' : 'You Win!';
            }
            return `Player ${winner} Wins!`;
        }
        if (isDraw) {
            return "It's a Draw!";
        }
        if (isSinglePlayer) {
            return currentPlayer === 'O' ? 'AI is thinking…' : 'Your Turn';
        }
        return `Player ${currentPlayer}'s Turn`;
    }, [winner, isDraw, currentPlayer, isSinglePlayer]);

    return {
        gameState,
        handlePress,
        resetGame,
        statusMessage,
        scores,
        history,
        currentStep,
        undo,
        redo,
        isSinglePlayer,
        toggleSinglePlayer,
    };
}

function minimax(board: Board, depth: number, isMaximizing: boolean, aiPlayer: Player): number {
    const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
    const winner = checkWinner(board);
    if (winner === aiPlayer) return 10 - depth;
    if (winner === humanPlayer) return depth - 10;
    if (board.every(cell => cell !== null)) return 0; // Create draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = aiPlayer;
                const score = minimax(board, depth + 1, false, aiPlayer);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = humanPlayer;
                const score = minimax(board, depth + 1, true, aiPlayer);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getBestMove(board: Board, aiPlayer: Player): number {
    // Optimization for first move when board is empty
    if (board.every(cell => cell === null)) {
        const firstMoves = [0, 2, 4, 6, 8]; // Corners and center are generally best
        return firstMoves[Math.floor(Math.random() * firstMoves.length)];
    }

    let bestScore = -Infinity;
    let move = -1;
    // Copy board so we don't mutate state
    const newBoard = [...board] as Board;
    for (let i = 0; i < 9; i++) {
        if (newBoard[i] === null) {
            newBoard[i] = aiPlayer;
            const score = minimax(newBoard, 0, false, aiPlayer);
            newBoard[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}
