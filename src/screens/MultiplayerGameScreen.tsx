import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Board } from '../components/Board';
import { GlowBackground } from '../components/GlowBackground';
import { ScoreCard } from '../components/ScoreCard';
import { StatusBadge, StatusTone } from '../components/StatusBadge';
import { GameOverModal } from '../components/GameOverModal';
import { Button } from '../components/Button';
import { MultiplayerState } from '../hooks/useMultiplayerGame';
import { GameState } from '../types';
import { colors, spacing, radius, typography, shadows } from '../theme';

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

    const [isReviewing, setIsReviewing] = React.useState(false);

    const handlePlayAgain = () => {
        setIsReviewing(false);
        onReset();
    };

    const handleLeave = () => {
        setIsReviewing(false);
        onLeave();
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
                    {!gameOver && (
                        <StatusBadge message={statusMessage} tone={tone} size="md" />
                    )}
                    {status === 'waiting' && (
                        <Text style={styles.waitingHint}>Share the room code with your friend</Text>
                    )}
                </View>

                {/* If reviewing the board, show the review toolbar */}
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
                            <Pressable 
                                style={({ pressed }) => [styles.reviewBtn, pressed && styles.reviewBtnPressed]}
                                onPress={handleLeave}
                            >
                                <Text style={styles.reviewBtnText}>Leave</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                <Board
                    board={board}
                    onSquarePress={onPress}
                    gameOver={gameOver || !isMyTurn}
                />

                {!gameOver && (
                    <Button label="Leave Room" variant="danger" onPress={onLeave} style={styles.leaveBtn} />
                )}

                <GameOverModal
                    visible={gameOver && !isReviewing}
                    statusMessage={statusMessage}
                    winner={winner}
                    isDraw={isDraw}
                    moveCount={board.filter(c => c !== null).length}
                    onPlayAgain={handlePlayAgain}
                    onMainMenu={handleLeave}
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
        marginBottom: spacing.xs,
        marginTop: spacing.xs,
    },
    title: {
        ...typography.titleSmall,
        fontSize: 32,
        color: colors.textPrimary,
        textShadowColor: 'rgba(0, 229, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
    roomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.xs,
        backgroundColor: colors.card,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
    },
    roomLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    roomCode: {
        fontSize: 14,
        fontWeight: '900',
        color: colors.cyan,
        letterSpacing: 3,
    },
    playerInfo: {
        marginBottom: spacing.sm,
    },
    youAre: {
        fontSize: 14,
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
        marginBottom: spacing.sm,
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    waitingHint: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    gameOverActions: {
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    leaveBtn: {
        marginTop: spacing.md,
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
