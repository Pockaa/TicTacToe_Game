import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameState } from '../types';
import { StatusBadge, StatusTone } from './StatusBadge';
import { Button } from './Button';
import { colors, spacing, radius } from '../theme';

interface GameInfoProps {
    statusMessage: string;
    gameState: GameState;
    onReset: () => void;
    onBackToMenu?: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = React.memo(({ statusMessage, gameState, onReset, onBackToMenu }) => {
    const tone: StatusTone = gameState.winner ? 'winner' : gameState.isDraw ? 'draw' : 'default';
    const isX = gameState.currentPlayer === 'X';

    return (
        <View style={styles.container}>
            <StatusBadge message={statusMessage} tone={tone} size="lg" style={styles.status} />

            <Text style={styles.moveCount}>
                Moves: {gameState.moveCount} / 9
            </Text>

            {!gameState.gameOver && (
                <View style={styles.playerIndicator}>
                    <View style={[styles.playerDot, isX ? styles.dotX : styles.dotO]} />
                    <Text style={styles.playerLabel}>
                        {isX ? 'Cyan (X)' : 'Pink (O)'}
                    </Text>
                </View>
            )}

            {gameState.gameOver && (
                <View style={styles.gameOverActions}>
                    <Button label="Play Again" variant="outline" accent={colors.cyan} onPress={onReset} />
                    {onBackToMenu && (
                        <Button label="Main Menu" variant="ghost" onPress={onBackToMenu} />
                    )}
                </View>
            )}
        </View>
    );
});

GameInfo.displayName = 'GameInfo';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        minHeight: 100, // keep height consistent so layout doesn't jump
    },
    status: {
        marginBottom: spacing.sm,
    },
    moveCount: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        fontWeight: '600',
        letterSpacing: 1,
    },
    playerIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        backgroundColor: colors.card,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
    },
    playerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: spacing.sm,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
    },
    dotX: {
        backgroundColor: colors.cyan,
        shadowColor: colors.cyan,
    },
    dotO: {
        backgroundColor: colors.pink,
        shadowColor: colors.pink,
    },
    playerLabel: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    gameOverActions: {
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
});
