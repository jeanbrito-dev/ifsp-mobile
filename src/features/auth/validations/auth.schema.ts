import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'E-mail é obrigatório' })
    .min(1, 'E-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  senha: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6, 'A senha deve conter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nome: z
      .string({ required_error: 'Nome é obrigatório' })
      .min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z
      .string({ required_error: 'E-mail é obrigatório' })
      .min(1, 'E-mail é obrigatório')
      .email('Formato de e-mail inválido'),
    senha: z
      .string({ required_error: 'Senha é obrigatória' })
      .min(6, 'A senha deve conter no mínimo 6 caracteres'),
    confirmSenha: z
      .string({ required_error: 'Confirmação de senha é obrigatória' })
      .min(6, 'A confirmação deve conter no mínimo 6 caracteres'),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmSenha'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'E-mail é obrigatório' })
    .min(1, 'E-mail é obrigatório')
    .email('Formato de e-mail inválido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: 'E-mail é obrigatório' })
      .min(1, 'E-mail é obrigatório')
      .email('Formato de e-mail inválido'),
    codigo: z
      .string({ required_error: 'Código é obrigatório' })
      .min(4, 'O código deve ter pelo menos 4 caracteres'),
    novaSenha: z
      .string({ required_error: 'Nova senha é obrigatória' })
      .min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
    confirmNovaSenha: z
      .string({ required_error: 'Confirmação de nova senha é obrigatória' })
      .min(6, 'A confirmação deve ter no mínimo 6 caracteres'),
  })
  .refine((data) => data.novaSenha === data.confirmNovaSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmNovaSenha'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
