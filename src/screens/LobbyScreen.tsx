import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { GlowBackground } from '../components/GlowBackground';
import { LogoMark } from '../components/LogoMark';
import { Button } from '../components/Button';
import { colors, spacing, radius, typography, withAlpha } from '../theme';

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
        <GlowBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <LogoMark cell={20} />
                    <Text style={styles.title}>Multiplayer</Text>
                    <Text style={styles.subtitle}>Play with a friend online</Text>
                </View>

                {mode === 'menu' ? (
                    <View style={styles.menuContainer}>
                        <Button
                            label="Create Room"
                            subtext="Get a code to share"
                            variant="primary"
                            fullWidth
                            loading={isConnecting}
                            onPress={onCreateRoom}
                        />
                        <Button
                            label="Join Room"
                            subtext="Enter a friend's code"
                            variant="secondary"
                            fullWidth
                            disabled={isConnecting}
                            onPress={() => setMode('join')}
                        />
                    </View>
                ) : (
                    <View style={styles.joinContainer}>
                        <Text style={styles.joinLabel}>Enter Room Code</Text>
                        <TextInput
                            style={styles.input}
                            value={joinCode}
                            onChangeText={(text) => setJoinCode(text.toUpperCase())}
                            placeholder="e.g. ABC12"
                            placeholderTextColor={colors.textMuted}
                            maxLength={5}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            editable={!isConnecting}
                        />
                        <Button
                            label="Join Game"
                            variant="primary"
                            fullWidth
                            disabled={joinCode.trim().length === 0}
                            loading={isConnecting}
                            onPress={handleJoin}
                        />
                        <Pressable
                            style={styles.backLink}
                            onPress={() => { setMode('menu'); setJoinCode(''); }}
                        >
                            <Text style={styles.backLinkText}>← Back</Text>
                        </Pressable>
                    </View>
                )}

                {errorMessage && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                )}

                <Pressable style={styles.backBtn} onPress={onBack}>
                    <Text style={styles.backBtnText}>← Back to Menu</Text>
                </Pressable>
            </View>
        </GlowBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    title: {
        ...typography.titleSmall,
        fontSize: 36,
        color: colors.textPrimary,
        marginTop: spacing.md,
        textShadowColor: withAlpha(colors.cyan, 0.5),
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 14,
    },
    subtitle: {
        ...typography.subtitle,
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    menuContainer: {
        width: '100%',
        maxWidth: 340,
        gap: spacing.md,
    },
    joinContainer: {
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        gap: spacing.lg,
    },
    joinLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    input: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
        textAlign: 'center',
        letterSpacing: 8,
        width: '100%',
    },
    backLink: {
        marginTop: spacing.xs,
    },
    backLinkText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    errorContainer: {
        marginTop: spacing.xl,
        backgroundColor: withAlpha(colors.pink, 0.1),
        borderWidth: 1,
        borderColor: colors.pink,
        borderRadius: radius.md,
        padding: spacing.md,
        maxWidth: 340,
        width: '100%',
    },
    errorText: {
        color: colors.pink,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    backBtn: {
        position: 'absolute',
        bottom: spacing.xl,
    },
    backBtnText: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: '600',
    },
});
