import { FlatList, Pressable, Text, View } from 'react-native';

import type { Tribute } from '../../../types/ifsp-content';
import { TributeAvatar } from './tribute-avatar';

type TributeStoriesProps = {
  tributes: Tribute[];
  onOpen: (tribute: Tribute) => void;
};

export function TributeStories({ tributes, onOpen }: TributeStoriesProps) {
  return (
    <View className="border-b border-gray-200 bg-white py-3">
      <FlatList
        horizontal
        data={tributes}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 px-4"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpen(item)}
            accessibilityRole="button"
            accessibilityLabel={`Abrir homenagem a ${item.name}`}
            className="w-[72px] items-center gap-1">
            <TributeAvatar tribute={item} size={68} ring />
            <Text className="text-xs text-gray-900" numberOfLines={1}>
              {item.name.split(' ')[0]}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}