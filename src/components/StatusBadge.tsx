import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { colors, withAlpha } from '../theme';

export type StatusTone = 'default' | 'winner' | 'draw' | 'turn';

interface StatusBadgeProps {
    message: string;
    tone?: StatusTone;
    size?: 'lg' | 'md';
    style?: StyleProp<TextStyle>;
}

const TONE_COLOR: Record<StatusTone, string> = {
    default: colors.textPrimary,
    winner: colors.green,
    draw: colors.amber,
    turn: colors.cyan,
};

/** Tone-colored status / turn text shared by the local and online game screens. */
export function StatusBadge({ message, tone = 'default', size = 'md', style }: StatusBadgeProps): React.JSX.Element {
    const toneColor = TONE_COLOR[tone];
    return (
        <Text
            style={[
                size === 'lg' ? styles.lg : styles.md,
                { color: toneColor },
                tone !== 'default'
                    ? {
                          textShadowColor: withAlpha(toneColor, 0.5),
                          textShadowOffset: { width: 0, height: 0 },
                          textShadowRadius: 10,
                      }
                    : null,
                style,
            ]}
        >
            {message}
        </Text>
    );
}

const styles = StyleSheet.create({
    lg: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    md: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
});
