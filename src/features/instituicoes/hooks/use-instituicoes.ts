import { useQuery } from '@tanstack/react-query';
import { instituicaoService } from '../../../services/api/instituicao.service';
import { instituicaoKeys } from '../../../services/query/instituicao-keys';
import { Instituicao, InstituicaoFilterParams } from '../../../types/instituicao';

export function useInstituicoes(params?: InstituicaoFilterParams) {
  return useQuery<Instituicao[], Error>({
    queryKey: instituicaoKeys.list(params as Record<string, unknown> | undefined),
    queryFn: () => instituicaoService.getAll(params),
  });
}

export function useInstituicao(id: string) {
  return useQuery<Instituicao, Error>({
    queryKey: instituicaoKeys.detail(id),
    queryFn: () => instituicaoService.getById(id),
    enabled: Boolean(id),
  });
}

