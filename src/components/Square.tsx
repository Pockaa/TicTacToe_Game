import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, } from 'react-native';
import { CellValue } from '../types';

const screenWidth: number = Dimensions.get('window').width;
const maxBoardWidth: number = 400; // Cap the maximum board width
const boardWidth: number = Math.min(screenWidth * 0.85, maxBoardWidth);
const squareSize: number = boardWidth / 3 - 8;

interface SquareProps {
    value: CellValue;
    onPress: () => void;
    disabled: boolean;
}

export const Square: React.FC<SquareProps> = React.memo(({ value, onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[
                styles.square,
                value !== null && styles.squareFilled,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.squareText,
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
        width: squareSize,
        height: squareSize,
        backgroundColor: '#151E32',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        margin: 5,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#2A3655',
    },
    squareFilled: {
        backgroundColor: '#1C2841',
    },
    squareText: {
        fontSize: squareSize * 0.55,
        fontWeight: '900',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    textX: {
        color: '#00E5FF',
        textShadowColor: 'rgba(0, 229, 255, 0.6)',
    },
    textO: {
        color: '#FF007F',
        textShadowColor: 'rgba(255, 0, 127, 0.6)',
    },
});