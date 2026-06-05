import React from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, withAlpha } from '../theme';

interface GlowBackgroundProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

// `filter` is a web-only CSS prop (react-native-web). Native ignores it, so the
// design still reads via the low-opacity blobs on the dark background.
const webBlur: any = Platform.OS === 'web' ? { filter: 'blur(80px)' } : undefined;

/**
 * Shared screen background: a dark safe-area surface with 3 soft colored "glow
 * blobs" behind the content for depth. The blob layer never intercepts touches.
 */
export function GlowBackground({ children, style }: GlowBackgroundProps): React.JSX.Element {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.blobLayer} pointerEvents="none">
                <View style={[styles.blob, styles.blobCyan, webBlur]} />
                <View style={[styles.blob, styles.blobPink, webBlur]} />
                <View style={[styles.blob, styles.blobPurple, webBlur]} />
            </View>
            <View style={[styles.content, style]}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    blobLayer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
    },
    blob: {
        position: 'absolute',
        borderRadius: 999,
    },
    blobCyan: {
        width: 360,
        height: 360,
        top: -130,
        left: -110,
        backgroundColor: withAlpha(colors.cyan, 0.12),
    },
    blobPink: {
        width: 360,
        height: 360,
        bottom: -150,
        right: -120,
        backgroundColor: withAlpha(colors.pink, 0.12),
    },
    blobPurple: {
        width: 300,
        height: 300,
        bottom: 100,
        left: -150,
        backgroundColor: withAlpha(colors.purple, 0.1),
    },
});
