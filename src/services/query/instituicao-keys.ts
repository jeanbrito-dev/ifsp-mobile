export const instituicaoKeys = {
  all: ['instituicoes'] as const,
  lists: () => [...instituicaoKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...instituicaoKeys.lists(), { filters }] as const,
  details: () => [...instituicaoKeys.all, 'detail'] as const,
  detail: (id: string) => [...instituicaoKeys.details(), id] as const,
  bySlug: (slug: string) => [...instituicaoKeys.all, 'slug', slug] as const,
};

