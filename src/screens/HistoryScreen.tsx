import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { GlowBackground } from '../components/GlowBackground';
import { Button } from '../components/Button';
import { useGameHistory } from '../context/GameHistoryContext';
import { GameLog, MoveEntry, GameMode } from '../types';
import { colors, spacing, radius, typography } from '../theme';

interface HistoryScreenProps {
    onBack: () => void;
}

const POSITION_LABELS = ['Top-Left', 'Top-Mid', 'Top-Right', 'Mid-Left', 'Center', 'Mid-Right', 'Bot-Left', 'Bot-Mid', 'Bot-Right'];

function getModeLabel(mode: GameMode): string {
    switch (mode) {
        case 'local': return 'Local PvP';
        case 'ai': return 'vs AI';
        case 'online': return 'Online';
    }
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getResultLabel(log: GameLog): string {
    if (!log.winner) {
        return log.isDraw ? 'Draw' : 'Incomplete';
    }
    // In an AI game the AI is 'O' and the human is 'X'.
    if (log.mode === 'ai') {
        return log.winner === 'O' ? 'AI Won' : 'You Won';
    }
    return `Player ${log.winner} Won`;
}

function GameLogCard({ log, expanded, onToggle }: { log: GameLog; expanded: boolean; onToggle: () => void }): React.JSX.Element {
    const result = getResultLabel(log);
    const resultColor = log.winner === 'X' ? colors.cyan : log.winner === 'O' ? colors.pink : colors.amber;

    return (
        <View style={styles.card}>
            <Pressable
                style={({ pressed }) => [styles.cardHeader, pressed && styles.cardHeaderPressed]}
                onPress={onToggle}
            >
                <View style={styles.cardHeaderLeft}>
                    <Text style={[styles.resultText, { color: resultColor }]}>{result}</Text>
                    <Text style={styles.modeText}>{getModeLabel(log.mode)}</Text>
                </View>
                <View style={styles.cardHeaderRight}>
                    <Text style={styles.dateText}>{formatDate(log.date)}</Text>
                    <Text style={styles.movesCount}>{log.moves.length} moves</Text>
                </View>
            </Pressable>

            {expanded && (
                <View style={styles.movesContainer}>
                    {log.moves.map((move: MoveEntry, idx: number) => (
                        <View key={idx} style={styles.moveRow}>
                            <Text style={styles.moveNumber}>#{move.moveNumber}</Text>
                            <Text style={[styles.movePlayer, move.player === 'X' ? styles.textX : styles.textO]}>
                                {move.player}
                            </Text>
                            <Text style={styles.movePosition}>{POSITION_LABELS[move.position]}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

export function HistoryScreen({ onBack }: HistoryScreenProps): React.JSX.Element {
    const { logs, clearLogs } = useGameHistory();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <GlowBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>History Logs</Text>
                    <Text style={styles.subtitle}>{logs.length} game{logs.length !== 1 ? 's' : ''} recorded</Text>
                </View>

                {logs.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No games played yet</Text>
                        <Text style={styles.emptySubtext}>Play a game and it will show up here</Text>
                    </View>
                ) : (
                    <>
                        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            {logs.map(log => (
                                <GameLogCard
                                    key={log.id}
                                    log={log}
                                    expanded={expandedId === log.id}
                                    onToggle={() => toggleExpand(log.id)}
                                />
                            ))}
                        </ScrollView>

                        <Button label="Clear All Logs" variant="danger" onPress={clearLogs} style={styles.clearBtn} />
                    </>
                )}

                <Pressable style={styles.backBtn} onPress={onBack}>
                    <Text style={styles.backBtnText}>← Back to Menu</Text>
                </Pressable>
            </View>
        </GlowBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
    },
    title: {
        ...typography.titleSmall,
        color: colors.textPrimary,
    },
    subtitle: {
        ...typography.subtitle,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: colors.textMuted,
        fontWeight: '700',
    },
    emptySubtext: {
        fontSize: 13,
        color: colors.textFaint,
        marginTop: spacing.xs,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.lg,
        gap: spacing.md,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
    },
    cardHeaderPressed: {
        backgroundColor: colors.cardElevated,
    },
    cardHeaderLeft: {
        gap: 2,
    },
    cardHeaderRight: {
        alignItems: 'flex-end',
        gap: 2,
    },
    resultText: {
        fontSize: 16,
        fontWeight: '800',
    },
    modeText: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dateText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    movesCount: {
        fontSize: 11,
        color: colors.textMuted,
        fontWeight: '600',
    },
    movesContainer: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        padding: spacing.md,
        gap: spacing.sm,
    },
    moveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    moveNumber: {
        fontSize: 12,
        color: colors.textMuted,
        fontWeight: '700',
        width: 24,
    },
    movePlayer: {
        fontSize: 14,
        fontWeight: '900',
        width: 20,
    },
    textX: {
        color: colors.cyan,
    },
    textO: {
        color: colors.pink,
    },
    movePosition: {
        fontSize: 13,
        color: '#CBD5E1',
        fontWeight: '600',
    },
    clearBtn: {
        alignSelf: 'center',
        marginTop: spacing.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    backBtn: {
        alignSelf: 'center',
        marginTop: spacing.lg,
    },
    backBtnText: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: '600',
    },
});
