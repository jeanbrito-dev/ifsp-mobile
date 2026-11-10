import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import '../global.css';
import { queryClient } from '../src/services/query/query-client';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
