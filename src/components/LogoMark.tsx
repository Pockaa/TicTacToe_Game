import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, withAlpha } from '../theme';

// A compact tic-tac-toe motif: X cells glow cyan, O cells glow pink.
const PATTERN: ('X' | 'O' | null)[] = ['X', 'O', null, null, 'X', null, 'O', null, 'X'];

interface LogoMarkProps {
    /** Side length of each cell in px. */
    cell?: number;
}

/** Small 3×3 brand mark shown above the title. */
export function LogoMark({ cell = 22 }: LogoMarkProps): React.JSX.Element {
    const gap = Math.round(cell * 0.18);
    return (
        <View style={[styles.grid, { width: cell * 3 + gap * 2, gap }]}>
            {PATTERN.map((v, i) => (
                <View
                    key={i}
                    style={[
                        styles.cell,
                        { width: cell, height: cell, borderRadius: Math.round(cell * 0.3) },
                        v === 'X' && { backgroundColor: withAlpha(colors.cyan, 0.15), borderColor: withAlpha(colors.cyan, 0.55) },
                        v === 'O' && { backgroundColor: withAlpha(colors.pink, 0.15), borderColor: withAlpha(colors.pink, 0.55) },
                    ]}
                >
                    {v ? (
                        <Text style={[styles.mark, { fontSize: cell * 0.6, color: v === 'X' ? colors.cyan : colors.pink }]}>
                            {v}
                        </Text>
                    ) : null}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    cell: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    mark: {
        fontWeight: '900',
    },
});
