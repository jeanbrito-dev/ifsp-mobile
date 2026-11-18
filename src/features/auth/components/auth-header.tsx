import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export function AuthHeader({ title, subtitle, iconName = 'calendar' }: AuthHeaderProps) {
  return (
    <View className="items-center mb-8">
      <View className="w-16 h-16 rounded-2xl bg-[#005C3B] items-center justify-center mb-4 shadow-sm">
        <Ionicons name={iconName} size={32} color="#FFFFFF" />
      </View>
      <Text className="text-2xl font-bold text-neutral-900 text-center tracking-tight">
        {title}
      </Text>
      <Text className="text-sm text-neutral-500 text-center mt-1.5 px-4">{subtitle}</Text>
    </View>
  );
}
