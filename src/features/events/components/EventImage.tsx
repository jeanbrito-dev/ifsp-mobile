
import React from 'react';

import {
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Feather } from '@expo/vector-icons';

interface EventImageProps {
  uri?: string | null;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function EventImage({
  uri,
  style,
  accessibilityLabel = 'Imagem do evento',
}: EventImageProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.frame, style]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          resizeMode="cover"
          accessibilityLabel={accessibilityLabel}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholder}>
          <Feather
            name="image"
            size={35}
            color="#A9A9A9"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
