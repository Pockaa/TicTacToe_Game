import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameHistory } from '../context/GameHistoryContext';
import { GameLog, MoveEntry, GameMode } from '../types';

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

function GameLogCard({ log, expanded, onToggle }: { log: GameLog; expanded: boolean; onToggle: () => void }): React.JSX.Element {
    const result = log.winner ? `Player ${log.winner} Won` : log.isDraw ? 'Draw' : 'Incomplete';
    const resultColor = log.winner === 'X' ? '#00E5FF' : log.winner === 'O' ? '#FF007F' : '#FBBF24';

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.cardHeader} onPress={onToggle} activeOpacity={0.7}>
                <View style={styles.cardHeaderLeft}>
                    <Text style={[styles.resultText, { color: resultColor }]}>{result}</Text>
                    <Text style={styles.modeText}>{getModeLabel(log.mode)}</Text>
                </View>
                <View style={styles.cardHeaderRight}>
                    <Text style={styles.dateText}>{formatDate(log.date)}</Text>
                    <Text style={styles.movesCount}>{log.moves.length} moves</Text>
                </View>
            </TouchableOpacity>

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
        <SafeAreaView style={styles.safeArea}>
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

                        <TouchableOpacity style={styles.clearBtn} onPress={clearLogs}>
                            <Text style={styles.clearBtnText}>Clear All Logs</Text>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                    <Text style={styles.backBtnText}>← Back to Menu</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#050B14',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#F8FAFC',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 6,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#64748B',
        fontWeight: '700',
    },
    emptySubtext: {
        fontSize: 13,
        color: '#475569',
        marginTop: 6,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
        gap: 12,
    },
    card: {
        backgroundColor: '#151E32',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2A3655',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
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
        color: '#94A3B8',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dateText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
    },
    movesCount: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600',
    },
    movesContainer: {
        borderTopWidth: 1,
        borderTopColor: '#2A3655',
        padding: 12,
        gap: 6,
    },
    moveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    moveNumber: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '700',
        width: 24,
    },
    movePlayer: {
        fontSize: 14,
        fontWeight: '900',
        width: 20,
    },
    textX: {
        color: '#00E5FF',
    },
    textO: {
        color: '#FF007F',
    },
    movePosition: {
        fontSize: 13,
        color: '#CBD5E1',
        fontWeight: '600',
    },
    clearBtn: {
        alignSelf: 'center',
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF007F',
    },
    clearBtnText: {
        fontSize: 13,
        color: '#FF007F',
        fontWeight: '700',
    },
    backBtn: {
        alignSelf: 'center',
        marginTop: 16,
    },
    backBtnText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
});
