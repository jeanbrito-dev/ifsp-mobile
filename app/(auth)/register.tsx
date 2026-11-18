import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '../../src/features/auth/components/auth-header';
import { RegisterForm } from '../../src/features/auth/components/register-form';

export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="max-w-md w-full mx-auto">
            <AuthHeader
              title="Crie sua conta"
              subtitle="Cadastre-se na plataforma do IFSP Eventos para participar, favoritar e acompanhar novidades"
              iconName="person-add"
            />
            <RegisterForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
