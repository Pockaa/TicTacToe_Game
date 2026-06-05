import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlowBackground } from '../components/GlowBackground';
import { LogoMark } from '../components/LogoMark';
import { MenuCard } from '../components/MenuCard';
import { colors, spacing, typography, withAlpha } from '../theme';

interface MenuScreenProps {
    onPlayLocal: () => void;
    onPlayOnline: () => void;
    onPlayAI: () => void;
    onHistory: () => void;
}

export function MenuScreen({ onPlayLocal, onPlayOnline, onPlayAI, onHistory }: MenuScreenProps): React.JSX.Element {
    return (
        <GlowBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <LogoMark cell={22} />
                    <Text style={styles.title}>Tic-Tac-Toe</Text>
                    <Text style={styles.subtitle}>IT Major Elective 4 — Game Development</Text>
                </View>

                <View style={styles.menuContainer}>
                    <MenuCard
                        iconName="people"
                        title="Play Local"
                        description="2 players, same device"
                        onPress={onPlayLocal}
                        accent={colors.cyan}
                        primary
                    />
                    <MenuCard
                        iconName="globe-outline"
                        title="Play Online"
                        description="Real-time multiplayer"
                        onPress={onPlayOnline}
                        accent={colors.green}
                    />
                    <MenuCard
                        iconName="hardware-chip-outline"
                        title="Play with AI"
                        description="Challenge the Minimax bot"
                        onPress={onPlayAI}
                        accent={colors.purpleLight}
                    />
                    <MenuCard
                        iconName="time-outline"
                        title="History Logs"
                        description="View past games & moves"
                        onPress={onHistory}
                        accent={colors.amber}
                    />
                </View>

                <Text style={styles.footer}>React Native + Expo • Supabase Realtime</Text>
            </View>
        </GlowBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxxl,
    },
    title: {
        ...typography.title,
        color: colors.textPrimary,
        marginTop: spacing.lg,
        textShadowColor: withAlpha(colors.cyan, 0.5),
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
    },
    subtitle: {
        ...typography.subtitle,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    menuContainer: {
        width: '100%',
        maxWidth: 380,
        gap: spacing.md,
    },
    footer: {
        ...typography.footer,
        color: colors.textMuted,
        position: 'absolute',
        bottom: spacing.xl,
    },
});
