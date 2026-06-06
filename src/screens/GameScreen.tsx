import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useGameLogic } from '../hooks/useGameLogic';
import { Board } from '../components/Board';
import { GameInfo } from '../components/GameInfo';
import { GameOverModal } from '../components/GameOverModal';
import { GlowBackground } from '../components/GlowBackground';
import { ScoreCard } from '../components/ScoreCard';
import { useGameHistory } from '../context/GameHistoryContext';
import { GameMode, AiDifficulty } from '../types';
import { colors, spacing, radius, typography, shadows, withAlpha } from '../theme';

interface GameScreenProps {
    onBack?: () => void;
    mode?: GameMode;
    aiDifficulty?: AiDifficulty;
}

export function GameScreen({ onBack, mode = 'local', aiDifficulty = 'hard' }: GameScreenProps): React.JSX.Element {
    const { addLog } = useGameHistory();

    const {
        gameState, handlePress, resetGame, statusMessage,
        scores, history, currentStep, undo, redo,
        isSinglePlayer, toggleSinglePlayer
    } = useGameLogic({
        mode,
        aiDifficulty,
        onGameEnd: (winner, isDraw, moves) => {
            addLog(mode, winner, isDraw, moves);
        },
    });

    const [isReviewing, setIsReviewing] = React.useState(false);

    const handlePlayAgain = () => {
        setIsReviewing(false);
        resetGame();
    };

    const canUndo = currentStep > 0;
    const canRedo = currentStep < history.length - 1;

    return (
        <GlowBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tic-Tac-Toe</Text>
                    <Text style={styles.subtitle}>
                        {mode === 'ai'
                            ? `You vs AI — ${aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)}`
                            : 'Local 2-Player'}
                    </Text>
                </View>

                {/* Score Tracker */}
                <View style={styles.scoreRow}>
                    <ScoreCard label="Player X" value={scores.X} accent={colors.cyan} valueAccent={colors.cyan} />
                    <ScoreCard label="Draws" value={scores.draws} accent={colors.amber} />
                    <ScoreCard
                        label={isSinglePlayer ? 'AI (O)' : 'Player O'}
                        value={scores.O}
                        accent={colors.pink}
                        valueAccent={colors.pink}
                    />
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <Pressable
                        onPress={undo}
                        disabled={!canUndo || gameState.gameOver}
                        style={({ pressed }) => [styles.controlBtn, (!canUndo || gameState.gameOver) && styles.disabledBtn, pressed && styles.controlPressed]}
                    >
                        <Text style={styles.controlText}>Undo</Text>
                    </Pressable>
                    {mode === 'local' && (
                        <Pressable
                            onPress={toggleSinglePlayer}
                            disabled={gameState.gameOver}
                            style={({ pressed }) => [styles.controlBtn, styles.controlDivider, gameState.gameOver && styles.disabledBtn, pressed && styles.controlPressed]}
                        >
                            <Text style={styles.controlText}>{isSinglePlayer ? 'Play vs Human' : 'Play vs AI'}</Text>
                        </Pressable>
                    )}
                    <Pressable
                        onPress={redo}
                        disabled={!canRedo || gameState.gameOver}
                        style={({ pressed }) => [styles.controlBtn, (!canRedo || gameState.gameOver) && styles.disabledBtn, pressed && styles.controlPressed]}
                    >
                        <Text style={styles.controlText}>Redo</Text>
                    </Pressable>
                </View>

                <GameInfo
                    statusMessage={statusMessage}
                    gameState={gameState}
                    onReset={resetGame}
                    onBackToMenu={onBack}
                />

                {isReviewing && (
                    <View style={styles.reviewBar}>
                        <Text style={styles.reviewTitle}>Reviewing Board</Text>
                        <View style={styles.reviewActions}>
                            <Pressable 
                                style={({ pressed }) => [styles.reviewBtn, pressed && styles.reviewBtnPressed]}
                                onPress={() => setIsReviewing(false)}
                            >
                                <Text style={styles.reviewBtnText}>Show Results</Text>
                            </Pressable>
                            <Pressable 
                                style={({ pressed }) => [styles.reviewBtn, styles.reviewBtnPrimary, pressed && styles.reviewBtnPressed]}
                                onPress={handlePlayAgain}
                            >
                                <Text style={styles.reviewBtnTextPrimary}>Play Again</Text>
                            </Pressable>
                            {onBack && (
                                <Pressable 
                                    style={({ pressed }) => [styles.reviewBtn, pressed && styles.reviewBtnPressed]}
                                    onPress={onBack}
                                >
                                    <Text style={styles.reviewBtnText}>Menu</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                )}

                <Board
                    board={gameState.board}
                    onSquarePress={handlePress}
                    gameOver={gameState.gameOver}
                />

                <Text style={styles.footer}>
                    {mode === 'ai'
                        ? `AI Difficulty: ${aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)}`
                        : 'Local PvP Mode'}
                    {' '}• React Native + Expo
                </Text>

                {onBack && (
                    <Pressable style={styles.backBtn} onPress={onBack}>
                        <Text style={styles.backBtnText}>← Back to Menu</Text>
                    </Pressable>
                )}

                <GameOverModal
                    visible={gameState.gameOver && !isReviewing}
                    statusMessage={statusMessage}
                    winner={gameState.winner}
                    isDraw={gameState.isDraw}
                    moveCount={gameState.moveCount}
                    onPlayAgain={handlePlayAgain}
                    onMainMenu={onBack || (() => {})}
                    onReviewBoard={() => setIsReviewing(true)}
                />
            </View>
        </GlowBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.lg,
        marginTop: spacing.xs,
    },
    title: {
        ...typography.titleSmall,
        fontSize: 32,
        color: colors.textPrimary,
        textShadowColor: withAlpha(colors.cyan, 0.5),
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 14,
    },
    subtitle: {
        ...typography.subtitle,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    scoreRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
        maxWidth: 360,
        marginBottom: spacing.md,
    },
    controls: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 360,
        backgroundColor: colors.card,
        borderRadius: radius.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        ...shadows.card,
    },
    controlBtn: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlDivider: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.border,
    },
    controlPressed: {
        backgroundColor: colors.cardElevated,
    },
    disabledBtn: {
        opacity: 0.3,
    },
    controlText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    footer: {
        ...typography.footer,
        color: colors.textMuted,
        marginTop: spacing.lg,
    },
    backBtn: {
        marginTop: spacing.md,
    },
    backBtnText: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: '600',
    },
    reviewBar: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: colors.card,
        borderRadius: radius.md,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm,
        ...shadows.card,
    },
    reviewTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.xs,
    },
    reviewActions: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
    },
    reviewBtn: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: 'transparent',
    },
    reviewBtnPrimary: {
        backgroundColor: colors.cyan,
        borderColor: colors.cyan,
    },
    reviewBtnPressed: {
        opacity: 0.8,
    },
    reviewBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    reviewBtnTextPrimary: {
        fontSize: 11,
        fontWeight: '800',
        color: colors.bg,
    },
});
