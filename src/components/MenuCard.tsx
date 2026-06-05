import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, withAlpha, spacing, radius, typography, shadows, glow } from '../theme';

// react-native-web adds `hovered` to the Pressable state callback; RN's types
// only declare `pressed`, so we widen it here. `hovered` is undefined on native.
type PressableState = { pressed: boolean; hovered?: boolean };

interface MenuCardProps {
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    onPress: () => void;
    accent: string;
    primary?: boolean;
    accessibilityLabel?: string;
}

/** A unified "glass" menu row: [icon chip] [title + description] [chevron]. */
export function MenuCard({
    iconName,
    title,
    description,
    onPress,
    accent,
    primary,
    accessibilityLabel,
}: MenuCardProps): React.JSX.Element {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? title}
            onPress={onPress}
            style={(state) => {
                const { pressed, hovered } = state as PressableState;
                return [
                    styles.card,
                    { borderColor: primary ? withAlpha(colors.cyan, 0.6) : colors.border },
                    primary && styles.cardPrimary,
                    hovered ? { borderColor: withAlpha(accent, 0.85), ...glow(accent, 0.3, 18) } : null,
                    pressed ? styles.cardPressed : null,
                ];
            }}
        >
            <View style={[styles.iconChip, { backgroundColor: withAlpha(accent, 0.15) }]}>
                <Ionicons name={iconName} size={24} color={accent} />
            </View>
            <View style={styles.textCol}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
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
    cardPrimary: {
        backgroundColor: withAlpha(colors.cyan, 0.08),
        ...glow(colors.cyan, 0.25, 16),
    },
    cardPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.92,
    },
    iconChip: {
        width: 48,
        height: 48,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCol: {
        flex: 1,
    },
    title: {
        ...typography.cardTitle,
        color: colors.textPrimary,
    },
    desc: {
        ...typography.cardDesc,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
});
