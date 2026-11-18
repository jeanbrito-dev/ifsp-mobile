import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppMark } from './components/AppMark';
import { EventImage } from './components/EventImage';
import type { EventComment, EventDetails, EventUser } from './types';

const GREEN = '#259B4B';

interface EventDetailsScreenProps {
  event: EventDetails;
  comments: EventComment[];
  isFavorite: boolean;
  currentUser?: EventUser;
  commentsLoading?: boolean;
  onBack: () => void;
  onToggleFavorite: () => void | Promise<void>;
  onSubmitComment: (message: string) => void | Promise<void>;
  onShare?: () => void;
}

export function EventDetailsScreen({
  event,
  comments,
  isFavorite,
  currentUser,
  commentsLoading = false,
  onBack,
  onToggleFavorite,
  onSubmitComment,
  onShare,
}: EventDetailsScreenProps) {
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  const submitComment = async () => {
    const message = draft.trim();
    if (!message || submitting) return;

    setSubmitting(true);
    setFeedback('');
    try {
      await onSubmitComment(message);
      setDraft('');
    } catch {
      setFeedback('Não foi possível publicar seu comentário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFavorite = async () => {
    if (favoriteBusy) return;
    setFavoriteBusy(true);
    setFeedback('');
    try {
      await onToggleFavorite();
    } catch {
      setFeedback('Não foi possível atualizar seus favoritos. Tente novamente.');
    } finally {
      setFavoriteBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={onBack} hitSlop={8}>
          <Feather name="arrow-left" size={21} color={GREEN} />
        </Pressable>
        <AppMark />
        <View style={styles.headerActions}>
          <MaterialCommunityIcons name="bell-outline" size={19} color={GREEN} />
          <View style={styles.profileIcon}>
            <Feather name="user" size={14} color={GREEN} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <EventImage uri={event.imageUrl} style={styles.heroImage} />

        <View style={styles.socialActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Compartilhar evento"
            onPress={onShare}
            disabled={!onShare}
            style={styles.socialButton}
          >
            <Feather name="share-2" size={19} color={GREEN} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            accessibilityState={{ selected: isFavorite, disabled: favoriteBusy }}
            onPress={toggleFavorite}
            disabled={favoriteBusy}
            style={styles.socialButton}
          >
            {favoriteBusy ? (
              <ActivityIndicator size="small" color={GREEN} />
            ) : (
              <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={21}
                color={isFavorite ? '#E53935' : GREEN}
              />
            )}
          </Pressable>
        </View>

        <View style={styles.titleBar}>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>

        <View style={styles.eventInfo}>
          <View style={styles.descriptionColumn}>
            <Text style={styles.description}>{event.description}</Text>
          </View>
          <View style={styles.metadataColumn}>
            <Text style={styles.metadataLabel}>Data</Text>
            <Text style={styles.metadataValue}>{event.dateLabel}</Text>
            <Text style={[styles.metadataLabel, styles.metadataGap]}>Instituição:</Text>
            <Text style={styles.metadataValue}>{event.institution}</Text>
            <Text style={[styles.metadataLabel, styles.metadataGap]}>Local:</Text>
            <Text style={styles.metadataValue}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>Comentários</Text>
          <Text style={styles.commentCount}>{comments.length}</Text>
        </View>

        {commentsLoading ? (
          <View style={styles.loadingComments}>
            <ActivityIndicator color={GREEN} />
          </View>
        ) : comments.length === 0 ? (
          <Text style={styles.noComments}>Seja a primeira pessoa a comentar sobre este evento.</Text>
        ) : (
          <View style={styles.commentsList}>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </View>
        )}

        {feedback.length > 0 && <Text accessibilityRole="alert" style={styles.feedback}>{feedback}</Text>}

        <View style={styles.commentComposer}>
          <TextInput
            accessibilityLabel="Escreva um comentário"
            value={draft}
            onChangeText={setDraft}
            placeholder="Escreva um comentário..."
            placeholderTextColor="#8B8B8B"
            multiline
            maxLength={1000}
            editable={!submitting}
            style={styles.commentInput}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enviar comentário"
            onPress={submitComment}
            disabled={!draft.trim() || submitting}
            style={[styles.sendButton, (!draft.trim() || submitting) && styles.sendButtonDisabled]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="send" size={17} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
        <Text style={styles.userHint}>
          Comentando como {currentUser?.name ?? 'usuário'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function CommentItem({ comment }: { comment: EventComment }) {
  const initials = comment.authorName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('pt-BR') ?? '')
    .join('');

  return (
    <View style={styles.commentCard}>
      {comment.avatarUrl ? (
        <Image source={{ uri: comment.avatarUrl }} accessibilityLabel={`Foto de ${comment.authorName}`} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>{initials || '?'}</Text>
        </View>
      )}
      <View style={styles.commentBody}>
        <View style={styles.commentAuthorRow}>
          <Text numberOfLines={1} style={styles.commentAuthor}>{comment.authorName}</Text>
          <Text style={styles.commentDate}>{comment.createdAtLabel}</Text>
        </View>
        <Text style={styles.commentMessage}>{comment.message}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

header: {
  minHeight: 56,
  paddingHorizontal: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  profileIcon: {
    width: 32,
    height: 32,
    borderWidth: 1.3,
    borderColor: GREEN,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 35,
  },

heroImage: {
  height: 205,
  width: '100%',
  alignSelf: 'center',
  borderRadius: 10,
  marginTop: 10,
},

  socialActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
  },

  socialButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

titleBar: {
  minHeight: 52,
  backgroundColor: GREEN,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 14,
  paddingVertical: 9,
},

eventTitle: {
  color: '#FFFFFF',
  fontSize: 19,
  lineHeight: 25,
  fontWeight: '700',
  textAlign: 'center',
},

eventInfo: {
  flexDirection: 'row',
  alignItems: 'stretch',
  marginTop: 12,
  marginBottom: 17,
  gap: 10,
},

  descriptionColumn: {
    flex: 1,
    paddingTop: 3,
  },


description: {
  color: '#3D3D3D',
  fontSize: 13,
  lineHeight: 19,
},

metadataColumn: {
  width: '43%',
  minHeight: 145,
  borderWidth: 1,
  borderColor: GREEN,
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 10,
},

metadataLabel: {
  color: GREEN,
  fontSize: 12,
  lineHeight: 17,
  fontWeight: '700',
},

metadataValue: {
  color: GREEN,
  fontSize: 12,
  lineHeight: 17,
},

  metadataGap: {
    marginTop: 10,
  },

  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 7,
    marginBottom: 12,
  },

commentsTitle: {
  color: '#252525',
  fontSize: 19,
  fontWeight: '700',
},

commentCount: {
  color: GREEN,
  fontSize: 14,
  fontWeight: '600',
},

  loadingComments: {
    paddingVertical: 25,
  },

  noComments: {
    paddingVertical: 16,
    color: '#777777',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  commentsList: {
    gap: 10,
  },

commentCard: {
  minHeight: 62,
  paddingHorizontal: 10,
  paddingVertical: 9,
  borderRadius: 9,
  borderLeftWidth: 3,
  borderLeftColor: GREEN,
  backgroundColor: '#F7F7F7',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 9,
},

  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D8EBDD',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D8EBDD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitials: {
    color: GREEN,
    fontSize: 13,
    fontWeight: '700',
  },

  commentBody: {
    flex: 1,
  },

  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

commentAuthor: {
  color: GREEN,
  fontSize: 13,
  fontWeight: '700',
},

commentDate: {
  color: '#8A8A8A',
  fontSize: 10,
},

commentMessage: {
  color: '#353535',
  fontSize: 13,
  lineHeight: 19,
  marginTop: 3,
},

  feedback: {
    color: '#B3261E',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 9,
  },

  commentComposer: {
    marginTop: 15,
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 11,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

commentInput: {
  flex: 1,
  minHeight: 38,
  maxHeight: 90,
  color: '#252525',
  fontSize: 14,
  paddingVertical: 5,
},

  sendButton: {
    width: 41,
    height: 41,
    borderRadius: 9,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },

  userHint: {
    color: '#888888',
    fontSize: 12,
    marginTop: 7,
    marginLeft: 3,
  },
});

