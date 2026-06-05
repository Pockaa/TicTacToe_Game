import React from 'react';
import { Text, Pressable, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { colors, withAlpha, spacing, radius, typography, glow } from '../theme';

type PressableState = { pressed: boolean; hovered?: boolean };

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    subtext?: string;
    accent?: string; // border + text color for the `outline` variant
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
}

/** Themed pressable button covering the app's button styles in one place. */
export function Button({
    label,
    onPress,
    variant = 'primary',
    subtext,
    accent = colors.cyan,
    disabled,
    loading,
    fullWidth,
    style,
}: ButtonProps): React.JSX.Element {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={onPress}
            disabled={disabled || loading}
            style={(state) => {
                const { pressed, hovered } = state as PressableState;
                return [
                    styles.base,
                    fullWidth && styles.fullWidth,
                    variant === 'primary' && styles.primary,
                    variant === 'secondary' && styles.secondary,
                    variant === 'outline' && { backgroundColor: colors.card, borderWidth: 1, borderColor: accent, ...glow(accent, 0.3, 14) },
                    variant === 'ghost' && styles.ghost,
                    variant === 'danger' && styles.danger,
                    hovered ? styles.hovered : null,
                    pressed ? styles.pressed : null,
                    disabled && styles.disabled,
                    style,
                ];
            }}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? colors.bg : accent} />
            ) : (
                <>
                    <Text
                        style={[
                            styles.label,
                            variant === 'primary' && styles.labelPrimary,
                            variant === 'secondary' && styles.labelLight,
                            variant === 'outline' && { color: accent },
                            variant === 'ghost' && styles.labelMuted,
                            variant === 'danger' && styles.labelDanger,
                        ]}
                    >
                        {label}
                    </Text>
                    {subtext ? (
                        <Text style={[styles.subtext, variant === 'primary' ? styles.subtextDark : styles.subtextLight]}>
                            {subtext}
                        </Text>
                    ) : null}
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    fullWidth: {
        width: '100%',
    },
    primary: {
        backgroundColor: colors.cyan,
        ...glow(colors.cyan, 0.25, 14),
    },
    secondary: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.textMuted,
    },
    danger: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.pink,
    },
    hovered: {
        transform: [{ scale: 1.02 }],
    },
    pressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    disabled: {
        opacity: 0.4,
    },
    label: {
        ...typography.button,
    },
    labelPrimary: {
        color: colors.bg,
    },
    labelLight: {
        color: colors.textPrimary,
    },
    labelMuted: {
        color: colors.textSecondary,
    },
    labelDanger: {
        color: colors.pink,
    },
    subtext: {
        fontSize: 12,
        marginTop: spacing.xs,
        fontWeight: '500',
    },
    subtextDark: {
        color: withAlpha(colors.bg, 0.75),
    },
    subtextLight: {
        color: colors.textSecondary,
    },
});
