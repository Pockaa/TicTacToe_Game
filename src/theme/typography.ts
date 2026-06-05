import { TextStyle } from 'react-native';

/**
 * Reusable text style tokens. Spread these into a StyleSheet entry, e.g.
 *   title: { ...typography.title, color: colors.textPrimary }
 *
 * No `fontFamily` is set (system font); the tokens are structured so a custom
 * display font can be slotted in later without touching the screens.
 */
export const typography = {
    title: {
        fontSize: 48,
        fontWeight: '900',
        letterSpacing: 2,
    },
    titleSmall: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    cardDesc: {
        fontSize: 12.5,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    button: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    footer: {
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
} satisfies Record<string, TextStyle>;
