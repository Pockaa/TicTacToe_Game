import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LobbyScreenProps {
    onCreateRoom: () => Promise<void>;
    onJoinRoom: (code: string) => Promise<void>;
    onBack: () => void;
    status: string;
    errorMessage: string | null;
}

export function LobbyScreen({ onCreateRoom, onJoinRoom, onBack, status, errorMessage }: LobbyScreenProps): React.JSX.Element {
    const [joinCode, setJoinCode] = useState('');
    const [mode, setMode] = useState<'menu' | 'join'>('menu');

    const isConnecting = status === 'connecting';

    const handleJoin = () => {
        if (joinCode.trim().length > 0) {
            onJoinRoom(joinCode.trim());
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Multiplayer</Text>
                    <Text style={styles.subtitle}>Play with a friend online</Text>
                </View>

                {mode === 'menu' ? (
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={onCreateRoom}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <ActivityIndicator color="#050B14" />
                            ) : (
                                <>
                                    <Text style={styles.primaryBtnText}>Create Room</Text>
                                    <Text style={styles.btnSubtext}>Get a code to share</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryBtn}
                            onPress={() => setMode('join')}
                            disabled={isConnecting}
                        >
                            <Text style={styles.secondaryBtnText}>Join Room</Text>
                            <Text style={styles.btnSubtextLight}>Enter a friend's code</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.joinContainer}>
                        <Text style={styles.joinLabel}>Enter Room Code</Text>
                        <TextInput
                            style={styles.input}
                            value={joinCode}
                            onChangeText={(text) => setJoinCode(text.toUpperCase())}
                            placeholder="e.g. ABC12"
                            placeholderTextColor="#64748B"
                            maxLength={5}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            editable={!isConnecting}
                        />
                        <TouchableOpacity
                            style={[styles.primaryBtn, joinCode.trim().length === 0 && styles.disabledBtn]}
                            onPress={handleJoin}
                            disabled={joinCode.trim().length === 0 || isConnecting}
                        >
                            {isConnecting ? (
                                <ActivityIndicator color="#050B14" />
                            ) : (
                                <Text style={styles.primaryBtnText}>Join Game</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.backLink}
                            onPress={() => { setMode('menu'); setJoinCode(''); }}
                        >
                            <Text style={styles.backLinkText}>← Back</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {errorMessage && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                    <Text style={styles.backBtnText}>← Back to Menu</Text>
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
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
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
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 8,
        fontWeight: '600',
    },
    menuContainer: {
        width: '100%',
        maxWidth: 320,
        gap: 16,
    },
    joinContainer: {
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
        gap: 16,
    },
    primaryBtn: {
        backgroundColor: '#00E5FF',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        width: '100%',
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
        width: '100%',
        borderWidth: 1,
        borderColor: '#2A3655',
    },
    secondaryBtnText: {
        fontSize: 18,
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
    joinLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F8FAFC',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#151E32',
        borderWidth: 1,
        borderColor: '#2A3655',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 24,
        fontWeight: '800',
        color: '#F8FAFC',
        textAlign: 'center',
        letterSpacing: 8,
        width: '100%',
    },
    disabledBtn: {
        opacity: 0.4,
    },
    backLink: {
        marginTop: 8,
    },
    backLinkText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
    },
    errorContainer: {
        marginTop: 20,
        backgroundColor: 'rgba(255, 0, 127, 0.1)',
        borderWidth: 1,
        borderColor: '#FF007F',
        borderRadius: 12,
        padding: 12,
        maxWidth: 320,
        width: '100%',
    },
    errorText: {
        color: '#FF007F',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    backBtn: {
        position: 'absolute',
        bottom: 40,
    },
    backBtnText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
});
