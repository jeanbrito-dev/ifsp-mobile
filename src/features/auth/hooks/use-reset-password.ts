import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../services/api/auth.service';
import { ApiMessageResponse, ResetPasswordRequest } from '../../../types/auth';

export function useResetPassword() {
  return useMutation<ApiMessageResponse, Error, ResetPasswordRequest>({
    mutationFn: ({ confirmNovaSenha: _, ...rest }: ResetPasswordRequest) =>
      authService.resetPassword(rest),
  });
}
