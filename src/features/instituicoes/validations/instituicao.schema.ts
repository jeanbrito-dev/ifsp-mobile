import { z } from 'zod';

export const instituicaoSchema = z.object({
  nome: z
    .string({ required_error: 'O nome da instituição é obrigatório' })
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(120, 'O nome deve ter no máximo 120 caracteres'),
  slug: z
    .string({ required_error: 'O slug (identificador) é obrigatório' })
    .trim()
    .toLowerCase()
    .min(2, 'O slug deve ter no mínimo 2 caracteres')
    .max(120, 'O slug deve ter no máximo 120 caracteres')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'O slug deve conter apenas letras minúsculas, números e hífens (ex: ifsp-spo)',
    ),
  descricao: z
    .string()
    .trim()
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
  logoUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        try {
          const url = new URL(val);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      },
      {
        message: 'Informe uma URL válida iniciada com http:// ou https://',
      },
    ),
});

export type InstituicaoFormData = z.infer<typeof instituicaoSchema>;

