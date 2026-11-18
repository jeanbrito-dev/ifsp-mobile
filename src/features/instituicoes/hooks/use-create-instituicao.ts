import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instituicaoService } from '../../../services/api/instituicao.service';
import { instituicaoKeys } from '../../../services/query/instituicao-keys';
import { CreateInstituicaoDto, Instituicao } from '../../../types/instituicao';

export function useCreateInstituicao() {
  const queryClient = useQueryClient();

  return useMutation<Instituicao, Error, CreateInstituicaoDto>({
    mutationFn: (data: CreateInstituicaoDto) => instituicaoService.create(data),
    onSuccess: (newInstituicao) => {
      queryClient.invalidateQueries({ queryKey: instituicaoKeys.all });
      queryClient.setQueryData(
        instituicaoKeys.detail(newInstituicao.id),
        newInstituicao,
      );
    },
  });
}

