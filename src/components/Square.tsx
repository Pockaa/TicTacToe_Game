import React from 'react';
import { TouchableOpacity, Text, StyleSheet, useWindowDimensions, } from 'react-native';
import { CellValue } from '../types';
import { colors, withAlpha } from '../theme';

interface SquareProps {
    value: CellValue;
    onPress: () => void;
    disabled: boolean;
}

export const Square: React.FC<SquareProps> = React.memo(({ value, onPress, disabled }) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    // Cap board width based on both screen width and height to guarantee it fits entirely
    const maxBoardWidth = Math.min(320, screenHeight * 0.35);
    const boardWidth = Math.min(screenWidth * 0.85, maxBoardWidth);
    const squareSize = boardWidth / 3 - 8;

    return (
        <TouchableOpacity
            style={[
                styles.square,
                { width: squareSize, height: squareSize },
                value !== null && styles.squareFilled,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.squareText,
                    { fontSize: squareSize * 0.55 },
                    value === 'X' && styles.textX,
                    value === 'O' && styles.textO,
                ]}
            >
                {value ?? ''}
            </Text>
        </TouchableOpacity>
    );
},
);

Square.displayName = 'Square';

const styles = StyleSheet.create({
    square: {
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        margin: 5,
        shadowColor: colors.cyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.border,
    },
    squareFilled: {
        backgroundColor: colors.cardElevated,
    },
    squareText: {
        fontWeight: '900',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    textX: {
        color: colors.cyan,
        textShadowColor: withAlpha(colors.cyan, 0.6),
    },
    textO: {
        color: colors.pink,
        textShadowColor: withAlpha(colors.pink, 0.6),
    },
});