import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { GameState } from '../types';

interface GameInfoProps {
    statusMessage: string;
    gameState: GameState;
    onReset: () => void;
    onBackToMenu?: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = React.memo(({ statusMessage, gameState, onReset, onBackToMenu }) => {
    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.status,
                    gameState.winner && styles.statusWinner,
                    gameState.isDraw && styles.statusDraw,
                ]}
            >
                {statusMessage}
            </Text>
            <Text style={styles.moveCount}>
                Moves: {gameState.moveCount} / 9
            </Text>
            {!gameState.gameOver && (
                <View style={styles.playerIndicator}>
                    <View
                        style={[
                            styles.playerDot,
                            gameState.currentPlayer === 'X'
                                ? styles.dotX
                                : styles.dotO,
                        ]}
                    />
                    <Text style={styles.playerLabel}>
                        {gameState.currentPlayer === 'X' ? 'Blue (X)' : 'Red (O)'}
                    </Text>
                </View>
            )}

            {gameState.gameOver && (
                <View style={styles.gameOverActions}>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={onReset}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.resetButtonText}>Play Again</Text>
                    </TouchableOpacity>
                    {onBackToMenu && (
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={onBackToMenu}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.menuButtonText}>Main Menu</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
},
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 15,
        minHeight: 100, // keep height consistent so layout doesn't jump
    },
    status: {
        fontSize: 30,
        fontWeight: '900',
        color: '#F8FAFC',
        marginBottom: 8,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(255, 255, 255, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    statusWinner: {
        color: '#00E5FF',
        textShadowColor: 'rgba(0, 229, 255, 0.6)',
    },
    statusDraw: {
        color: '#FBBF24',
        textShadowColor: 'rgba(251, 191, 36, 0.6)',
    },
    moveCount: {
        fontSize: 14,
        color: '#94A3B8',
        marginBottom: 10,
        fontWeight: '600',
        letterSpacing: 1,
    },
    playerIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        backgroundColor: '#151E32',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2A3655',
    },
    playerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
    },
    dotX: {
        backgroundColor: '#00E5FF',
        shadowColor: '#00E5FF',
    },
    dotO: {
        backgroundColor: '#FF007F',
        shadowColor: '#FF007F',
    },
    playerLabel: {
        fontSize: 14,
        color: '#F8FAFC',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    resetButton: {
        marginTop: 15,
        backgroundColor: '#151E32',
        paddingHorizontal: 36,
        paddingVertical: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#00E5FF',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 6,
    },
    resetButtonText: {
        color: '#00E5FF',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    gameOverActions: {
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },
    menuButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#64748B',
    },
    menuButtonText: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});