import { isAxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response)
      return 'Não foi possível conectar ao servidor. Verifique sua internet.';
    if (error.response.status >= 500) return 'O servidor está indisponível no momento.';
    if (error.response.status === 404) return 'Conteúdo não encontrado.';
  }
  return 'Algo deu errado. Tente novamente.';
}
