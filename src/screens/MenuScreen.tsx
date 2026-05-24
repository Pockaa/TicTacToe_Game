import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuScreenProps {
    onSinglePlayer: () => void;
    onMultiplayer: () => void;
}

export function MenuScreen({ onSinglePlayer, onMultiplayer }: MenuScreenProps): React.JSX.Element {
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
                    <TouchableOpacity style={styles.primaryBtn} onPress={onSinglePlayer}>
                        <Text style={styles.primaryBtnText}>Local Game</Text>
                        <Text style={styles.btnSubtext}>Play vs AI or a friend locally</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryBtn} onPress={onMultiplayer}>
                        <Text style={styles.secondaryBtnText}>Online Multiplayer</Text>
                        <Text style={styles.btnSubtextLight}>Play with a friend online</Text>
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
        marginBottom: 60,
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
        gap: 16,
    },
    primaryBtn: {
        backgroundColor: '#00E5FF',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    primaryBtnText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#050B14',
        letterSpacing: 0.5,
    },
    secondaryBtn: {
        backgroundColor: '#151E32',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A3655',
    },
    secondaryBtnText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#F8FAFC',
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
