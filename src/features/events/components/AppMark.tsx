
import React from 'react';
import { StyleSheet, View } from 'react-native';

const CELLS = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [0, 2], [1, 2],
  [0, 3], [1, 3],
];

export function AppMark() {
  return (
    <View
      accessibilityLabel="IFSP Eventos"
      style={styles.mark}
    >
      {CELLS.map(([column, row], index) => (
        <View
          key={`${column}-${row}-${index}`}
          style={[
            styles.cell,
            {
              left: column * 6.5,
              top: row * 6.5,
              opacity: index > 6 ? 0.78 : 1,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 24,
    height: 31,
    position: 'relative',
  },

  cell: {
    width: 5.2,
    height: 5.2,
    borderRadius: 1,
    backgroundColor: '#259B4B',
    position: 'absolute',
  },
});
