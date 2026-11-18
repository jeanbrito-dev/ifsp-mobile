
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { neutral } from '../../../theme/neutral';
import type { Tribute } from '../../../types/ifsp-content';
import { TRIBUTE_INTERACTIONS_ENABLED, TRIBUTE_REACTIONS } from '../constants';

type TributeActionsProps = {
  tribute: Tribute;
  onToggleLike: () => void;
  onToggleReaction: (emoji: string) => void;
  onShare: () => void;
};

const reactionLabel = (emoji: string) =>
  TRIBUTE_REACTIONS.find((item) => item.emoji === emoji)?.label ?? emoji;

export function TributeActions({
  tribute,
  onToggleLike,
  onToggleReaction,
  onShare,
}: TributeActionsProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const visibleReactions = tribute.reactions.filter(
    (reaction) => reaction.count > 0,
  );

  return (
    <View className="gap-2">

      {/* Botões principais */}
      <View className="flex-row items-center">

        {TRIBUTE_INTERACTIONS_ENABLED ? (
          <>
            <Pressable
              onPress={onToggleLike}
              accessibilityRole="button"
              accessibilityState={{ selected: tribute.likedByMe }}
              accessibilityLabel={
                tribute.likedByMe
                  ? `Remover curtida da homenagem a ${tribute.name}`
                  : `Curtir homenagem a ${tribute.name}`
              }
              className="h-11 w-11 items-center justify-center"
            >
              <Ionicons
                name={tribute.likedByMe ? 'heart' : 'heart-outline'}
                size={28}
                color={tribute.likedByMe ? neutral.danger : neutral.ink}
              />
            </Pressable>

            <Pressable
              onPress={() => setPickerOpen((open) => !open)}
              accessibilityRole="button"
              accessibilityState={{ expanded: pickerOpen }}
              accessibilityLabel="Reagir com emoji"
              className="h-11 w-11 items-center justify-center"
            >
              <Ionicons
                name="happy-outline"
                size={26}
                color={neutral.ink}
              />
            </Pressable>
          </>
        ) : null}

        <Pressable
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel={`Compartilhar homenagem a ${tribute.name}`}
          className="h-11 w-11 items-center justify-center"
        >
          <Ionicons
            name="paper-plane-outline"
            size={26}
            color={neutral.ink}
          />
        </Pressable>

      </View>

      {/* Opções de emojis */}
      {TRIBUTE_INTERACTIONS_ENABLED && pickerOpen ? (
        <View className="flex-row gap-1 self-start rounded-full bg-gray-100 px-2">
          {TRIBUTE_REACTIONS.map(({ emoji, label }) => (
            <Pressable
              key={emoji}
              onPress={() => {
                onToggleReaction(emoji);
                setPickerOpen(false);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Reagir com ${label}`}
              className="h-11 w-11 items-center justify-center"
            >
              <Text className="text-2xl">{emoji}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Quantidade de curtidas */}
      {TRIBUTE_INTERACTIONS_ENABLED && tribute.likesCount > 0 ? (
        <Text className="font-semibold text-gray-900">
          {tribute.likesCount === 1
            ? '1 curtida'
            : `${tribute.likesCount} curtidas`}
        </Text>
      ) : null}

      {/* Quantidade de reações */}
      {TRIBUTE_INTERACTIONS_ENABLED && visibleReactions.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {visibleReactions.map((reaction) => (
            <Pressable
              key={reaction.emoji}
              onPress={() => onToggleReaction(reaction.emoji)}
              accessibilityRole="button"
              accessibilityState={{ selected: reaction.reactedByMe }}
              accessibilityLabel={`${reactionLabel(reaction.emoji)}: ${reaction.count}. ${
                reaction.reactedByMe
                  ? 'Remover sua reação'
                  : 'Reagir também'
              }`}
              className={`min-h-[36px] flex-row items-center gap-1 rounded-full border px-3 ${
                reaction.reactedByMe
                  ? 'border-brand bg-brand/10'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text>{reaction.emoji}</Text>

              <Text
                className={
                  reaction.reactedByMe
                    ? 'font-semibold text-brand'
                    : 'text-gray-900'
                }
              >
                {reaction.count}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

    </View>
  );
}
