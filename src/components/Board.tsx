import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Square } from './Square';
import { Board as BoardType } from '../types';
import { colors } from '../theme';

interface BoardProps {
    board: BoardType
    onSquarePress: (index: number) => void;
    gameOver: boolean;
}

export const Board: React.FC<BoardProps> = React.memo(
    ({ board, onSquarePress, gameOver }) => {
        const createPressHandler = useCallback(
            (index: number) => () => onSquarePress(index),
            [onSquarePress],
        );

        const renderRow = (rowIndex: number): React.JSX.Element => {
            const startIndex: number = rowIndex * 3;
            return (
                <View key={rowIndex} style={styles.row}>
                    {[0, 1, 2].map((col: number) => {
                        const cellIndex: number = startIndex + col;
                        return (
                            <Square
                                key={cellIndex}
                                value={board[cellIndex]}
                                onPress={createPressHandler(cellIndex)}
                                disabled={gameOver || board[cellIndex] !== null}
                            />
                        );
                    })}
                </View>
            );
        };
        return (
            <View style={styles.board}>
                {[0, 1, 2].map(renderRow)}
            </View>
        );
    },
);

Board.displayName = 'Board';

const styles = StyleSheet.create({
    board: {
        backgroundColor: colors.bgElevated,
        borderRadius: 24,
        padding: 12,
        // Glowing shadow effect
        shadowColor: colors.cyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: colors.card,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});