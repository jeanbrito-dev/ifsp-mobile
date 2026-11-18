import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import type { Tribute } from '../../../types/ifsp-content';

type TributeAvatarProps = {
  tribute: Pick<Tribute, 'name' | 'photoUrl'>;
  size: number;
  ring?: boolean;
};

export function TributeAvatar({ tribute, size, ring = false }: TributeAvatarProps) {
  const inner = ring ? size - 8 : size;
  const initial = tribute.name.trim().charAt(0).toUpperCase();

  const content = tribute.photoUrl ? (
    <Image
      source={{ uri: tribute.photoUrl }}
      style={{ width: inner, height: inner, borderRadius: inner / 2 }}
      contentFit="cover"
      accessibilityLabel={`Foto de ${tribute.name}`}
    />
  ) : (
    <View
      className="items-center justify-center bg-brand"
      style={{ width: inner, height: inner, borderRadius: inner / 2 }}>
      <Text className="font-bold text-accent" style={{ fontSize: Math.round(inner * 0.45) }}>
        {initial}
      </Text>
    </View>
  );

  if (!ring) return content;

  return (
    <View
      className="items-center justify-center rounded-full border-2 border-accent"
      style={{ width: size, height: size }}>
      {content}
    </View>
  );
}