import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuScreenProps {
    onPlayLocal: () => void;
    onPlayOnline: () => void;
    onPlayAI: () => void;
    onHistory: () => void;
}

export function MenuScreen({ onPlayLocal, onPlayOnline, onPlayAI, onHistory }: MenuScreenProps): React.JSX.Element {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tic-Tac-Toe</Text>
                    <Text style={styles.subtitle}>
                        IT Major Elective 4 — Game Development
                    </Text>
                </View>

                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={onPlayLocal}>
                        <Text style={styles.primaryBtnText}>Play Local</Text>
                        <Text style={styles.btnSubtext}>2 players, same device</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryBtn} onPress={onPlayOnline}>
                        <Text style={styles.secondaryBtnText}>Play Online</Text>
                        <Text style={styles.btnSubtextLight}>Real-time multiplayer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.aiBtn} onPress={onPlayAI}>
                        <Text style={styles.aiBtnText}>Play with AI</Text>
                        <Text style={styles.btnSubtextLight}>Challenge the Minimax bot</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.historyBtn} onPress={onHistory}>
                        <Text style={styles.historyBtnText}>History Logs</Text>
                        <Text style={styles.btnSubtextLight}>View past games & moves</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footer}>React Native + Expo • Supabase Realtime</Text>
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
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#F8FAFC',
        letterSpacing: 3,
        textShadowColor: 'rgba(255, 255, 255, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 10,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    menuContainer: {
        width: '100%',
        maxWidth: 320,
        gap: 14,
    },
    primaryBtn: {
        backgroundColor: '#00E5FF',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    primaryBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#050B14',
        letterSpacing: 0.5,
    },
    secondaryBtn: {
        backgroundColor: '#151E32',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A3655',
    },
    secondaryBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#F8FAFC',
        letterSpacing: 0.5,
    },
    aiBtn: {
        backgroundColor: '#151E32',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6D28D9',
    },
    aiBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#A78BFA',
        letterSpacing: 0.5,
    },
    historyBtn: {
        backgroundColor: '#151E32',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FBBF24',
    },
    historyBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FBBF24',
        letterSpacing: 0.5,
    },
    btnSubtext: {
        fontSize: 12,
        color: '#050B14',
        marginTop: 4,
        opacity: 0.7,
    },
    btnSubtextLight: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});
