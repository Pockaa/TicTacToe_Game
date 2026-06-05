import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useGameLogic } from '../hooks/useGameLogic';
import { Board } from '../components/Board';
import { GameInfo } from '../components/GameInfo';
import { GlowBackground } from '../components/GlowBackground';
import { ScoreCard } from '../components/ScoreCard';
import { useGameHistory } from '../context/GameHistoryContext';
import { GameMode } from '../types';
import { colors, spacing, radius, typography, shadows, withAlpha } from '../theme';

interface GameScreenProps {
    onBack?: () => void;
    mode?: GameMode;
}

export function GameScreen({ onBack, mode = 'local' }: GameScreenProps): React.JSX.Element {
    const { addLog } = useGameHistory();

    const {
        gameState, handlePress, resetGame, statusMessage,
        scores, history, currentStep, undo, redo,
        isSinglePlayer, toggleSinglePlayer
    } = useGameLogic({
        mode,
        onGameEnd: (winner, isDraw, moves) => {
            addLog(mode, winner, isDraw, moves);
        },
    });

    const canUndo = currentStep > 0;
    const canRedo = currentStep < history.length - 1;

    return (
        <GlowBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tic-Tac-Toe</Text>
                    <Text style={styles.subtitle}>
                        {mode === 'ai' ? 'You vs AI (Minimax)' : 'Local 2-Player'}
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
                        disabled={!canUndo}
                        style={({ pressed }) => [styles.controlBtn, !canUndo && styles.disabledBtn, pressed && styles.controlPressed]}
                    >
                        <Text style={styles.controlText}>Undo</Text>
                    </Pressable>
                    {mode === 'local' && (
                        <Pressable
                            onPress={toggleSinglePlayer}
                            style={({ pressed }) => [styles.controlBtn, styles.controlDivider, pressed && styles.controlPressed]}
                        >
                            <Text style={styles.controlText}>{isSinglePlayer ? 'Play vs Human' : 'Play vs AI'}</Text>
                        </Pressable>
                    )}
                    <Pressable
                        onPress={redo}
                        disabled={!canRedo}
                        style={({ pressed }) => [styles.controlBtn, !canRedo && styles.disabledBtn, pressed && styles.controlPressed]}
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

                <Board
                    board={gameState.board}
                    onSquarePress={handlePress}
                    gameOver={gameState.gameOver}
                />

                <Text style={styles.footer}>
                    {mode === 'ai' ? 'AI uses Minimax (Hard)' : 'Local PvP Mode'} • React Native + Expo
                </Text>

                {onBack && (
                    <Pressable style={styles.backBtn} onPress={onBack}>
                        <Text style={styles.backBtnText}>← Back to Menu</Text>
                    </Pressable>
                )}
            </View>
        </GlowBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
        marginTop: spacing.sm,
    },
    title: {
        ...typography.titleSmall,
        fontSize: 36,
        color: colors.textPrimary,
        textShadowColor: withAlpha(colors.cyan, 0.5),
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 14,
    },
    subtitle: {
        ...typography.subtitle,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    scoreRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
        maxWidth: 360,
        marginBottom: spacing.lg,
    },
    controls: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 360,
        backgroundColor: colors.card,
        borderRadius: radius.md,
        marginBottom: spacing.md,
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
        marginTop: spacing.xxl,
    },
    backBtn: {
        marginTop: spacing.lg,
    },
    backBtnText: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: '600',
    },
});
