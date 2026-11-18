import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '../../src/features/auth/components/auth-header';
import { ForgotPasswordForm } from '../../src/features/auth/components/forgot-password-form';

export default function ForgotPasswordScreen() {
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
              title="Recuperação de Senha"
              subtitle="Informe seu e-mail institucional para enviarmos as instruções com o código de redefinição"
              iconName="mail-unread"
            />
            <ForgotPasswordForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
