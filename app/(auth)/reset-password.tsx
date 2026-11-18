import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '../../src/features/auth/components/auth-header';
import { ResetPasswordForm } from '../../src/features/auth/components/reset-password-form';

export default function ResetPasswordScreen() {
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
              title="Redefinição de Senha"
              subtitle="Digite o código enviado ao seu e-mail e escolha sua nova senha de acesso"
              iconName="key"
            />
            <ResetPasswordForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
