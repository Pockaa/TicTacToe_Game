import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Board } from '../components/Board';
import { MultiplayerState } from '../hooks/useMultiplayerGame';
import { GameState } from '../types';

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tic-Tac-Toe</Text>
                    <View style={styles.roomInfo}>
                        <Text style={styles.roomLabel}>Room Code:</Text>
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
                <View style={styles.scoreBoard}>
                    <View style={[styles.scoreCard, styles.cardX, myPlayer === 'X' && styles.cardHighlight]}>
                        <Text style={styles.scoreLabel}>{myPlayer === 'X' ? 'You (X)' : 'Opponent (X)'}</Text>
                        <Text style={[styles.scoreValue, styles.textX]}>{scores.X}</Text>
                    </View>
                    <View style={[styles.scoreCard, styles.cardDraw]}>
                        <Text style={styles.scoreLabel}>Draws</Text>
                        <Text style={styles.scoreValue}>{scores.draws}</Text>
                    </View>
                    <View style={[styles.scoreCard, styles.cardO, myPlayer === 'O' && styles.cardHighlight]}>
                        <Text style={styles.scoreLabel}>{myPlayer === 'O' ? 'You (O)' : 'Opponent (O)'}</Text>
                        <Text style={[styles.scoreValue, styles.textO]}>{scores.O}</Text>
                    </View>
                </View>

                {/* Status */}
                <View style={styles.statusContainer}>
                    <Text style={[
                        styles.status,
                        winner && styles.statusWinner,
                        isDraw && styles.statusDraw,
                        isMyTurn && styles.statusMyTurn,
                    ]}>
                        {statusMessage}
                    </Text>
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
                    <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
                        <Text style={styles.resetBtnText}>Play Again</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.leaveBtn} onPress={onLeave}>
                    <Text style={styles.leaveBtnText}>Leave Room</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#050B14',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#F8FAFC',
        letterSpacing: 2,
        textShadowColor: 'rgba(255, 255, 255, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    roomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: '#151E32',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2A3655',
    },
    roomLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        marginRight: 6,
    },
    roomCode: {
        fontSize: 16,
        fontWeight: '900',
        color: '#00E5FF',
        letterSpacing: 3,
    },
    playerInfo: {
        marginBottom: 12,
    },
    youAre: {
        fontSize: 16,
        color: '#F8FAFC',
        fontWeight: '700',
    },
    scoreBoard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 340,
        marginBottom: 12,
    },
    scoreCard: {
        flex: 1,
        backgroundColor: '#151E32',
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 16,
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#2A3655',
    },
    cardX: {
        borderBottomWidth: 3,
        borderBottomColor: '#00E5FF',
    },
    cardO: {
        borderBottomWidth: 3,
        borderBottomColor: '#FF007F',
    },
    cardDraw: {
        borderBottomWidth: 3,
        borderBottomColor: '#FBBF24',
    },
    cardHighlight: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    scoreLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    scoreValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#F8FAFC',
    },
    textX: {
        color: '#00E5FF',
        textShadowColor: 'rgba(0, 229, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    textO: {
        color: '#FF007F',
        textShadowColor: 'rgba(255, 0, 127, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    status: {
        fontSize: 18,
        fontWeight: '800',
        color: '#F8FAFC',
    },
    statusWinner: {
        color: '#4ADE80',
    },
    statusDraw: {
        color: '#FBBF24',
    },
    statusMyTurn: {
        color: '#00E5FF',
    },
    waitingHint: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    resetBtn: {
        marginTop: 16,
        backgroundColor: '#00E5FF',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    resetBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#050B14',
    },
    leaveBtn: {
        marginTop: 20,
    },
    leaveBtnText: {
        fontSize: 14,
        color: '#FF007F',
        fontWeight: '700',
    },
});
