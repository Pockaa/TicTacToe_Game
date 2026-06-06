import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowBackground } from '../components/GlowBackground';
import { LogoMark } from '../components/LogoMark';
import { colors, withAlpha, spacing, radius, typography, shadows, glow } from '../theme';
import { AiDifficulty } from '../types';

type PressableState = { pressed: boolean; hovered?: boolean };

interface DifficultyOption {
    key: AiDifficulty;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    accent: string;
}

const DIFFICULTIES: DifficultyOption[] = [
    {
        key: 'easy',
        title: 'Easy',
        description: 'Random moves — great for beginners',
        icon: 'leaf-outline',
        accent: colors.green,
    },
    {
        key: 'medium',
        title: 'Medium',
        description: 'Blocks & attacks, sometimes slips up',
        icon: 'flame-outline',
        accent: colors.amber,
    },
    {
        key: 'hard',
        title: 'Hard',
        description: 'Unbeatable Minimax — good luck!',
        icon: 'skull-outline',
        accent: colors.pink,
    },
];

interface DifficultyScreenProps {
    onSelect: (difficulty: AiDifficulty) => void;
    onBack: () => void;
}

export function DifficultyScreen({ onSelect, onBack }: DifficultyScreenProps): React.JSX.Element {
    return (
        <GlowBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <LogoMark cell={22} />
                    <Text style={styles.title}>Choose Difficulty</Text>
                    <Text style={styles.subtitle}>How tough should the AI be?</Text>
                </View>

                <View style={styles.cardContainer}>
                    {DIFFICULTIES.map((diff) => (
                        <Pressable
                            key={diff.key}
                            accessibilityRole="button"
                            accessibilityLabel={`${diff.title} difficulty`}
                            onPress={() => onSelect(diff.key)}
                            style={(state) => {
                                const { pressed, hovered } = state as PressableState;
                                return [
                                    styles.card,
                                    hovered
                                        ? { borderColor: withAlpha(diff.accent, 0.85), ...glow(diff.accent, 0.3, 18) }
                                        : null,
                                    pressed ? styles.cardPressed : null,
                                ];
                            }}
                        >
                            <View style={[styles.iconChip, { backgroundColor: withAlpha(diff.accent, 0.15) }]}>
                                <Ionicons name={diff.icon} size={28} color={diff.accent} />
                            </View>
                            <View style={styles.textCol}>
                                <Text style={[styles.cardTitle, { color: diff.accent }]}>{diff.title}</Text>
                                <Text style={styles.cardDesc}>{diff.description}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </Pressable>
                    ))}
                </View>

                <Pressable style={styles.backBtn} onPress={onBack}>
                    <Text style={styles.backBtnText}>← Back to Menu</Text>
                </Pressable>

                <Text style={styles.footer}>Select a difficulty to start playing</Text>
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
        textShadowColor: withAlpha(colors.purpleLight, 0.5),
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
    },
    subtitle: {
        ...typography.subtitle,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    cardContainer: {
        width: '100%',
        maxWidth: 380,
        gap: spacing.md,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        cursor: 'pointer',
        ...shadows.card,
    },
    cardPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.92,
    },
    iconChip: {
        width: 52,
        height: 52,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCol: {
        flex: 1,
    },
    cardTitle: {
        ...typography.cardTitle,
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    cardDesc: {
        ...typography.cardDesc,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    backBtn: {
        marginTop: spacing.xxl,
    },
    backBtnText: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: '600',
    },
    footer: {
        ...typography.footer,
        color: colors.textMuted,
        position: 'absolute',
        bottom: spacing.xl,
    },
});
