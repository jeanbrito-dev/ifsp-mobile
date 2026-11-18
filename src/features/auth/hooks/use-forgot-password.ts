import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../services/api/auth.service';
import { ApiMessageResponse, ForgotPasswordRequest } from '../../../types/auth';

export function useForgotPassword() {
  return useMutation<ApiMessageResponse, Error, ForgotPasswordRequest>({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
  });
}
