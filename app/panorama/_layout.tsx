import { Stack } from 'expo-router';

import { theme } from '../../src/theme/tokens';

export default function PanoramaLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.brand },
        headerTintColor: theme.colors.background,
        headerTitleStyle: { fontWeight: '600' },
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Panorama IFSP' }} />
      <Stack.Screen name="homenagens/index" options={{ title: 'Homenagens' }} />
      <Stack.Screen name="homenagens/[id]" options={{ title: 'Homenagem' }} />
      <Stack.Screen name="calendario" options={{ title: 'Calendário acadêmico' }} />
      <Stack.Screen name="documentos/index" options={{ title: 'Editais e documentos' }} />
      <Stack.Screen name="documentos/[id]" options={{ title: 'Documento' }} />
    </Stack>
  );
}
