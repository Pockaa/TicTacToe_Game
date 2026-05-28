export type Player = 'X' | 'O';
export type CellValue = Player | null;

export type Board = [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue];

export interface GameState {
    board: Board;
    currentPlayer: Player;
    winner: Player | null;
    isDraw: boolean;
    gameOver: boolean;
    moveCount: number;
}

export interface Scores {
    X: number;
    O: number;
    draws: number;
}

export interface GameActions {
    gameState: GameState;
    handlePress: (index: number) => void;
    resetGame: () => void;
    statusMessage: string;
    scores: Scores;
    history: Board[];
    currentStep: number;
    undo: () => void;
    redo: () => void;
    isSinglePlayer: boolean;
    toggleSinglePlayer: () => void;
}

// History log types
export interface MoveEntry {
    player: Player;
    position: number; // 0-8 cell index
    moveNumber: number;
}

export type GameMode = 'local' | 'ai' | 'online';

export interface GameLog {
    id: string;
    mode: GameMode;
    winner: Player | null;
    isDraw: boolean;
    moves: MoveEntry[];
    date: string; // ISO string
}