import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../../services/api/auth.service';
import { authKeys } from '../../../services/query/auth-keys';
import { AuthResponse, LoginCredentials } from '../../../types/auth';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session(), data);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
