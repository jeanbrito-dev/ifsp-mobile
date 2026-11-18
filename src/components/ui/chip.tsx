import { Pressable, Text } from 'react-native';

type ChipProps = { label: string; selected: boolean; onPress: () => void };

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Filtrar por ${label}`}
      className={`min-h-[40px] justify-center rounded-full border px-4 ${
        selected ? 'border-brand bg-brand' : 'border-gray-200 bg-white'
      }`}
    >
      <Text className={selected ? 'font-semibold text-white' : 'text-gray-900'}>
        {label}
      </Text>
    </Pressable>
  );
}
