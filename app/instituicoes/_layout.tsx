import React from 'react';
import { Stack } from 'expo-router';

export default function InstituicoesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F9FAFB' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Instituições' }} />
      <Stack.Screen name="cadastro" options={{ title: 'Nova Instituição' }} />
    </Stack>
  );
}

