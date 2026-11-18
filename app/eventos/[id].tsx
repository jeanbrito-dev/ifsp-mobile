
import React, { useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

import { EventDetailsScreen } from '../../src/features/events/EventDetailsScreen';

import type { EventComment } from '../../src/features/events/types';

import {
  DEMO_EVENTS,
  DEMO_COMMENTS,
} from '../../src/features/events/demo-data';

export default function EventDetailsRoute() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const event = DEMO_EVENTS.find(
    (item) => item.id === id
  );

  const [isFavorite, setIsFavorite] = useState(false);

  const [comments, setComments] =
    useState<EventComment[]>(DEMO_COMMENTS);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Evento não encontrado.
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Voltar
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  function handleComment(message: string) {
    setComments((previous) => [
      ...previous,
      {
        id: String(Date.now()),
        authorName: 'Você',
        message,
        createdAtLabel: 'Agora',
      },
    ]);
  }

  return (
    <EventDetailsScreen
      event={event}
      comments={comments}
      isFavorite={isFavorite}
      currentUser={{ name: 'Você' }}
      onBack={() => router.back()}
      onToggleFavorite={() => {
        setIsFavorite((previous) => !previous);
      }}
      onSubmitComment={handleComment}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 17,
    color: '#333333',
  },
  button: {
    backgroundColor: '#259B4B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
  },
});
