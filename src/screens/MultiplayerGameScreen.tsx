import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Board } from '../components/Board';
import { GlowBackground } from '../components/GlowBackground';
import { ScoreCard } from '../components/ScoreCard';
import { StatusBadge, StatusTone } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { MultiplayerState } from '../hooks/useMultiplayerGame';
import { GameState } from '../types';
import { colors, spacing, radius, typography } from '../theme';

interface MultiplayerGameScreenProps {
    state: MultiplayerState;
    onPress: (index: number) => void;
    onReset: () => void;
    onLeave: () => void;
}

export function MultiplayerGameScreen({ state, onPress, onReset, onLeave }: MultiplayerGameScreenProps): React.JSX.Element {
    const { board, currentPlayer, winner, isDraw, gameOver, myPlayer, roomCode, status, statusMessage, scores } = state;

    const gameState: GameState = {
        board,
        currentPlayer,
        winner,
        isDraw,
        gameOver,
        moveCount: board.filter(c => c !== null).length,
    };

    const isMyTurn = currentPlayer === myPlayer && status === 'playing';
    const tone: StatusTone = winner ? 'winner' : isDraw ? 'draw' : isMyTurn ? 'turn' : 'default';

    return (
        <GlowBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tic-Tac-Toe</Text>
                    <View style={styles.roomInfo}>
                        <Text style={styles.roomLabel}>Room Code</Text>
                        <Text style={styles.roomCode}>{roomCode}</Text>
                    </View>
                </View>

                {/* Player Info */}
                <View style={styles.playerInfo}>
                    <Text style={styles.youAre}>
                        You are <Text style={myPlayer === 'X' ? styles.textX : styles.textO}>{myPlayer}</Text>
                    </Text>
                </View>

                {/* Score Tracker */}
                <View style={styles.scoreRow}>
                    <ScoreCard
                        label={myPlayer === 'X' ? 'You (X)' : 'Opponent (X)'}
                        value={scores.X}
                        accent={colors.cyan}
                        valueAccent={colors.cyan}
                        highlight={myPlayer === 'X'}
                    />
                    <ScoreCard label="Draws" value={scores.draws} accent={colors.amber} />
                    <ScoreCard
                        label={myPlayer === 'O' ? 'You (O)' : 'Opponent (O)'}
                        value={scores.O}
                        accent={colors.pink}
                        valueAccent={colors.pink}
                        highlight={myPlayer === 'O'}
                    />
                </View>

                {/* Status */}
                <View style={styles.statusContainer}>
                    <StatusBadge message={statusMessage} tone={tone} size="md" />
                    {status === 'waiting' && (
                        <Text style={styles.waitingHint}>Share the room code with your friend</Text>
                    )}
                </View>

                <Board
                    board={board}
                    onSquarePress={onPress}
                    gameOver={gameOver || !isMyTurn}
                />

                {/* Game Over Actions */}
                {gameOver && (
                    <View style={styles.gameOverActions}>
                        <Button label="Play Again" variant="primary" onPress={onReset} />
                        <Button label="Main Menu" variant="ghost" onPress={onLeave} />
                    </View>
                )}

                {!gameOver && (
                    <Button label="Leave Room" variant="danger" onPress={onLeave} style={styles.leaveBtn} />
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
        marginBottom: spacing.sm,
        marginTop: spacing.sm,
    },
    title: {
        ...typography.titleSmall,
        color: colors.textPrimary,
        textShadowColor: 'rgba(0, 229, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
    roomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.sm,
        backgroundColor: colors.card,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
    },
    roomLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    roomCode: {
        fontSize: 16,
        fontWeight: '900',
        color: colors.cyan,
        letterSpacing: 3,
    },
    playerInfo: {
        marginBottom: spacing.md,
    },
    youAre: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    textX: {
        color: colors.cyan,
        fontWeight: '900',
    },
    textO: {
        color: colors.pink,
        fontWeight: '900',
    },
    scoreRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
        maxWidth: 360,
        marginBottom: spacing.md,
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    waitingHint: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    gameOverActions: {
        alignItems: 'center',
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    leaveBtn: {
        marginTop: spacing.xl,
    },
});
