
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import type { Tribute } from '../../../types/ifsp-content';
import { TRIBUTE_INTERACTIONS_ENABLED } from '../constants';
import { TributeActions } from './tribute-actions';
import { TributeAvatar } from './tribute-avatar';

const DOUBLE_TAP_MS = 300;
const LONG_CAPTION = 90;

type TributePostProps = {
  tribute: Tribute;
  onToggleLike: () => void;
  onToggleReaction: (emoji: string) => void;
  onShare: () => void;
};

export function TributePost({
  tribute,
  onToggleLike,
  onToggleReaction,
  onShare,
}: TributePostProps) {
  const [expanded, setExpanded] = useState(false);
  const lastTap = useRef(0);
  const heart = useRef(new Animated.Value(0)).current;

  const subtitle = [tribute.role, tribute.period]
    .filter(Boolean)
    .join(' · ');

  const initial = tribute.name.trim().charAt(0).toUpperCase();

  const fullText = [
    tribute.summary,
    tribute.biography,
  ]
    .filter(Boolean)
    .join('\n\n');

  const isLongCaption = fullText.length > LONG_CAPTION;

  const playHeart = () => {
    heart.setValue(0);

    Animated.sequence([
      Animated.spring(heart, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.delay(350),
      Animated.timing(heart, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePhotoPress = () => {
    const now = Date.now();

    if (now - lastTap.current < DOUBLE_TAP_MS) {
      lastTap.current = 0;

      if (!TRIBUTE_INTERACTIONS_ENABLED) return;

      playHeart();

      if (!tribute.likedByMe) {
        onToggleLike();
      }
    } else {
      lastTap.current = now;
    }
  };

  return (
    <View className="border-b border-gray-200 bg-white pb-3">

      {/* Cabeçalho */}
      <View className="min-h-[56px] flex-row items-center gap-3 px-4 py-2">
        <TributeAvatar tribute={tribute} size={36} ring />

        <View className="flex-1">
          <Text
            className="font-semibold text-gray-900"
            numberOfLines={1}>
            {tribute.name}
          </Text>

          {subtitle ? (
            <Text
              className="text-xs text-gray-500"
              numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Foto em paisagem e centralizada */}
      <Pressable
        onPress={handlePhotoPress}
        accessibilityRole="imagebutton"
        accessibilityLabel={`Foto de ${tribute.name}`}
        accessibilityHint={
          TRIBUTE_INTERACTIONS_ENABLED
            ? 'Dois toques rápidos para curtir'
            : undefined
        }>
        <View
          style={{
            width: '90%',
            aspectRatio: 4 / 3,
            alignSelf: 'center',
            position: 'relative',
          }}>
          {tribute.photoUrl ? (
            <Image
              source={{ uri: tribute.photoUrl }}
              style={{
                width: '100%',
                height: '100%',
              }}
              contentFit="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-brand">
              <Text className="text-8xl font-bold text-accent">
                {initial}
              </Text>
            </View>
          )}

          {/* Animação de curtida */}
          <Animated.View
            pointerEvents="none"
            className="absolute inset-0 items-center justify-center"
            style={{
              opacity: heart,
              transform: [
                {
                  scale: heart.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1.2],
                  }),
                },
              ],
            }}>
            <Ionicons name="heart" size={96} color="#FFFFFF" />
          </Animated.View>
        </View>
      </Pressable>

      {/* Curtidas e reações */}
      <View className="px-4">
        <TributeActions
          tribute={tribute}
          onToggleLike={onToggleLike}
          onToggleReaction={onToggleReaction}
          onShare={onShare}
        />
      </View>

      {/* Legenda */}
      <View className="px-4 pt-2">
        <Text className="text-gray-900">
          <Text className="font-semibold">
            {tribute.name}{' '}
          </Text>

          {expanded ? fullText : tribute.summary}
        </Text>

        {isLongCaption ? (
          <Pressable
            onPress={() => setExpanded(!expanded)}
            accessibilityRole="button"
            className="min-h-[36px] justify-center">
            <Text className="text-gray-500">
              {expanded ? 'Ver menos' : 'Ver homenagem completa'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
