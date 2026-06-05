/**
 * Central color palette for the app.
 * Previously these hex values were hardcoded and duplicated across every screen;
 * this file is now the single source of truth.
 */
export const colors = {
    // Surfaces
    bg: '#050B14',          // app background (deep navy)
    bgElevated: '#0B0F19',  // slightly raised surface (e.g. board)
    card: '#151E32',        // card / button background
    cardElevated: '#1C2841',// filled square / highlighted card
    border: '#2A3655',      // subtle borders

    // Text
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textFaint: '#475569',

    // Accents
    cyan: '#00E5FF',        // Player X / primary accent
    pink: '#FF007F',        // Player O / destructive
    amber: '#FBBF24',       // draws / history
    green: '#4ADE80',       // winner status
    purple: '#6D28D9',      // AI accent (deep)
    purpleLight: '#A78BFA', // AI accent (text)
} as const;

export type ColorKey = keyof typeof colors;

/**
 * Convert a 6-digit hex color to an `rgba()` string with the given alpha.
 * Used for tints, glows and translucent fills so they aren't hand-written.
 */
export function withAlpha(hex: string, alpha: number): string {
    const normalized = hex.replace('#', '');
    const r = parseInt(normalized.substring(0, 2), 16);
    const g = parseInt(normalized.substring(2, 4), 16);
    const b = parseInt(normalized.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
