import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { theme } from '../../../theme/tokens';
import { neutral } from '../../../theme/neutral';

const SECTIONS: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
}[] = [
  {
    title: 'Homenagens',
    description: 'Pessoas que marcaram a história do IFSP',
    icon: 'ribbon-outline',
    href: '/panorama/homenagens',
  },
  {
    title: 'Calendário acadêmico',
    description: 'Aulas, provas, prazos e feriados',
    icon: 'calendar-outline',
    href: '/panorama/calendario',
  },
  {
    title: 'Editais e documentos',
    description: 'Consulte, visualize e baixe documentos oficiais',
    icon: 'document-text-outline',
    href: '/panorama/documentos',
  },
];

export function PanoramaScreen() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="gap-3 p-4">
      {SECTIONS.map((section) => (
        <Pressable
          key={section.title}
          onPress={() => router.push(section.href)}
          accessibilityRole="button"
          accessibilityLabel={`${section.title}. ${section.description}`}
          className="flex-row items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 active:bg-gray-100"
        >
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-brand">
            <Ionicons name={section.icon} size={26} color={theme.colors.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">{section.title}</Text>
            <Text className="text-gray-500">{section.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={neutral.muted} />
        </Pressable>
      ))}
    </ScrollView>
  );
}
