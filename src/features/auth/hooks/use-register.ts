import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../../services/api/auth.service';
import { authKeys } from '../../../services/query/auth-keys';
import { AuthResponse, RegisterCredentials } from '../../../types/auth';

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: ({ confirmSenha: _, ...rest }: RegisterCredentials) =>
      authService.register(rest),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session(), data);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
