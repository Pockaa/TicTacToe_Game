import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated } from 'react-native';
import { Button } from './Button';
import { colors, spacing, radius, typography, withAlpha, glow } from '../theme';

interface GameOverModalProps {
    visible: boolean;
    statusMessage: string;
    winner: 'X' | 'O' | null;
    isDraw: boolean;
    moveCount?: number;
    onPlayAgain: () => void;
    onMainMenu: () => void;
    onReviewBoard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = React.memo(({
    visible,
    statusMessage,
    winner,
    isDraw,
    moveCount,
    onPlayAgain,
    onMainMenu,
    onReviewBoard,
}) => {
    // Determine accent color based on outcome
    const accentColor = winner === 'X' 
        ? colors.cyan 
        : winner === 'O' 
        ? colors.pink 
        : isDraw 
        ? colors.amber 
        : colors.textPrimary;

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.85)).current;

    useEffect(() => {
        if (visible) {
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.85);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000, // Slow fade-in (1 second)
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000, // Slow scale-up (1 second)
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, fadeAnim, scaleAnim]);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onMainMenu}
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Animated.View style={[
                    styles.modalCard, 
                    { 
                        borderTopColor: accentColor,
                        transform: [{ scale: scaleAnim }]
                    },
                    glow(accentColor, 0.2, 24)
                ]}>
                    {/* Header outcome title */}
                    <Text style={[
                        styles.title, 
                        { color: accentColor, textShadowColor: withAlpha(accentColor, 0.4) }
                    ]}>
                        {statusMessage}
                    </Text>

                    {/* Move counts, if provided */}
                    {moveCount !== undefined && (
                        <Text style={styles.subtitle}>
                            Completed in {moveCount} moves
                        </Text>
                    )}

                    <View style={styles.divider} />

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Button 
                            label="Play Again" 
                            variant="primary" 
                            fullWidth 
                            accent={accentColor}
                            onPress={onPlayAgain} 
                            style={styles.actionBtn}
                        />
                        <Button 
                            label="Review Board" 
                            variant="outline" 
                            fullWidth 
                            accent={accentColor}
                            onPress={onReviewBoard} 
                            style={styles.actionBtn}
                        />
                        <Button 
                            label="Main Menu" 
                            variant="ghost" 
                            fullWidth 
                            onPress={onMainMenu}
                            style={styles.actionBtn}
                        />
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
});

GameOverModal.displayName = 'GameOverModal';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(5, 8, 16, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalCard: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: colors.bgElevated,
        borderRadius: radius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.card,
        borderTopWidth: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: spacing.xs,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        ...typography.subtitle,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    divider: {
        width: '80%',
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.md,
    },
    actions: {
        width: '100%',
        gap: spacing.sm,
    },
    actionBtn: {
        paddingVertical: spacing.md,
    },
});
