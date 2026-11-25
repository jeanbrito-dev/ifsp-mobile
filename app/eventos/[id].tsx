
import React, { useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

import { EventDetailsScreen } from '../../src/features/events/EventDetailsScreen';

import { useEvent } from '../../src/features/events/hooks/use-events';

import { useEventComments } from '../../src/features/events/hooks/use-event-comments';

import { useAuth } from '../../src/contexts/auth-context';

export default function EventDetailsRoute() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { user } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);

  const eventQuery = useEvent(id);

  const commentsQuery = useEventComments(id);

  if (eventQuery.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#259B4B"
        />

        <Text style={styles.loadingText}>
          Carregando evento...
        </Text>
      </SafeAreaView>
    );
  }

  if (eventQuery.isError || !eventQuery.data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Não foi possível carregar o evento.
        </Text>

        <Pressable
          onPress={() => {
            void eventQuery.refetch();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Tentar novamente
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            Voltar
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <EventDetailsScreen
      event={eventQuery.data}

      comments={commentsQuery.comments}

      commentsLoading={commentsQuery.isLoading}

      commentsError={
        commentsQuery.isError
          ? 'Não foi possível carregar os comentários.'
          : null
      }

      onRetryComments={() => {
        void commentsQuery.refetch();
      }}

      isFavorite={isFavorite}

      currentUser={{
        name: user?.nome ?? 'Usuário',
      }}

      onBack={() => router.back()}

      onToggleFavorite={() => {
        setIsFavorite((previous) => !previous);
      }}

      onSubmitComment={async (message) => {
        await commentsQuery.createComment(message);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: '#555555',
    fontSize: 14,
  },

  title: {
    fontSize: 17,
    color: '#333333',
    textAlign: 'center',
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
    fontWeight: '600',
  },

  backButton: {
    marginTop: 15,
    padding: 10,
  },

  backButtonText: {
    color: '#259B4B',
  },
});
