import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, withAlpha, spacing, radius, shadows, glow } from '../theme';

interface ScoreCardProps {
    label: string;
    value: number;
    accent: string;       // bottom-border accent color
    valueAccent?: string; // if set, the value text takes this color + glow
    highlight?: boolean;  // adds an outer glow (e.g. the local player's card)
}

/** One cell of the 3-up score row, shared by the local and online game screens. */
export function ScoreCard({ label, value, accent, valueAccent, highlight }: ScoreCardProps): React.JSX.Element {
    return (
        <View
            style={[
                styles.card,
                { borderBottomColor: accent },
                highlight ? glow(accent, 0.3, 10) : null,
            ]}
        >
            <Text style={styles.label}>{label}</Text>
            <Text
                style={[
                    styles.value,
                    valueAccent
                        ? {
                              color: valueAccent,
                              textShadowColor: withAlpha(valueAccent, 0.5),
                              textShadowOffset: { width: 0, height: 0 },
                              textShadowRadius: 8,
                          }
                        : null,
                ]}
            >
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: colors.card,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomWidth: 3,
        ...shadows.card,
    },
    label: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: '700',
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    value: {
        fontSize: 26,
        fontWeight: '900',
        color: colors.textPrimary,
    },
});
