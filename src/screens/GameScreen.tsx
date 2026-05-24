import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameLogic } from '../hooks/useGameLogic';
import { Board } from '../components/Board';
import { GameInfo } from '../components/GameInfo';

interface GameScreenProps {
    onBack?: () => void;
}

export function GameScreen({ onBack }: GameScreenProps): React.JSX.Element {
    const { 
        gameState, handlePress, resetGame, statusMessage,
        scores, history, currentStep, undo, redo,
        isSinglePlayer, toggleSinglePlayer
    } = useGameLogic();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tic-Tac-Toe</Text>
                    <Text style={styles.subtitle}>
                        IT Major Elective 4 — Game Development
                    </Text>
                </View>

                {/* Score Tracker */}
                <View style={styles.scoreBoard}>
                    <View style={[styles.scoreCard, styles.cardX]}>
                        <Text style={styles.scoreLabel}>Player X</Text>
                        <Text style={[styles.scoreValue, styles.textX]}>{scores.X}</Text>
                    </View>
                    <View style={[styles.scoreCard, styles.cardDraw]}>
                        <Text style={styles.scoreLabel}>Draws</Text>
                        <Text style={styles.scoreValue}>{scores.draws}</Text>
                    </View>
                    <View style={[styles.scoreCard, styles.cardO]}>
                        <Text style={styles.scoreLabel}>{isSinglePlayer ? 'AI (O)' : 'Player O'}</Text>
                        <Text style={[styles.scoreValue, styles.textO]}>{scores.O}</Text>
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity 
                        onPress={undo} 
                        disabled={currentStep === 0} 
                        style={[styles.controlBtn, currentStep === 0 && styles.disabledBtn, { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]}
                    >
                        <Text style={styles.controlText}>Undo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={toggleSinglePlayer} 
                        style={[styles.controlBtn, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#e2e8f0' }]}
                    >
                        <Text style={styles.controlText}>{isSinglePlayer ? 'Play vs Human' : 'Play vs AI'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={redo} 
                        disabled={currentStep === history.length - 1} 
                        style={[styles.controlBtn, currentStep === history.length - 1 && styles.disabledBtn, { borderTopRightRadius: 10, borderBottomRightRadius: 10 }]}
                    >
                        <Text style={styles.controlText}>Redo</Text>
                    </TouchableOpacity>
                </View>

                <GameInfo
                    statusMessage={statusMessage}
                    gameState={gameState}
                    onReset={resetGame}
                />

                <Board
                    board={gameState.board}
                    onSquarePress={handlePress}
                    gameOver={gameState.gameOver}
                />

                <Text style={styles.footer}>
                    {isSinglePlayer ? 'AI uses Minimax (Hard)' : 'PvP Mode'} • React Native + Expo
                </Text>

                {onBack && (
                    <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                        <Text style={styles.backBtnText}>← Back to Menu</Text>
                    </TouchableOpacity>
                )}
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
        marginBottom: 20,
        marginTop: 10,
    },
    title: {
        fontSize: 38,
        fontWeight: '900',
        color: '#F8FAFC',
        letterSpacing: 2,
        textShadowColor: 'rgba(255, 255, 255, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 6,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    scoreBoard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 340,
        marginBottom: 15,
    },
    scoreCard: {
        flex: 1,
        backgroundColor: '#151E32',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 16,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
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
    scoreLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '700',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scoreValue: {
        fontSize: 26,
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
    controls: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#151E32',
        borderRadius: 12,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2A3655',
    },
    controlBtn: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledBtn: {
        opacity: 0.3,
    },
    controlText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#F8FAFC',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    footer: {
        marginTop: 35,
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    backBtn: {
        marginTop: 16,
    },
    backBtnText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
});