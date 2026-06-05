import { ViewStyle } from 'react-native';
import { colors } from './colors';

/**
 * Shadow presets. Each includes BOTH iOS/web keys (shadow*) and the Android key
 * (elevation) so depth renders consistently across platforms.
 */
export const shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 6,
    },
    glowCyan: {
        shadowColor: colors.cyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
        elevation: 8,
    },
} satisfies Record<string, ViewStyle>;

/** Build a colored glow shadow for any accent color (cards, buttons, chips). */
export function glow(color: string, opacity = 0.35, radius = 16): ViewStyle {
    return {
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: 8,
    };
}
