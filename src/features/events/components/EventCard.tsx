
import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { EventImage } from './EventImage';
import type { ExploreEvent } from '../types';

interface EventCardProps {
  event: ExploreEvent;
  onPress: (eventId: string) => void;
}

export function EventCard({
  event,
  onPress,
}: EventCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir evento ${event.title}`}
      onPress={() => onPress(event.id)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <EventImage
        uri={event.imageUrl}
        style={styles.image}
      />

      <Text numberOfLines={2} style={styles.title}>
        {event.title}
      </Text>

      <Text numberOfLines={1} style={styles.date}>
        {event.dateLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.4%',
    marginBottom: 21,
  },

  pressed: {
    opacity: 0.78,
  },

  image: {
    height: 155,
    borderRadius: 10,
    marginBottom: 9,
  },

  title: {
    color: '#242424',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
  },

  date: {
    color: '#259B4B',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
});
