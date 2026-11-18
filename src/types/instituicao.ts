/**
 * Tipos e interfaces para a entidade Instituicao,
 * baseados no model Instituicao do Prisma (ifsp-api/prisma/schema.prisma).
 */

export interface Instituicao {
  id: string;
  nome: string;
  slug: string;
  descricao?: string | null;
  logoUrl?: string | null;
  criadoEm?: string;
  atualizadoEm?: string | null;
  /**
   * Quantidade de eventos vinculados (opcional para exibição em listas e contadores)
   */
  _count?: {
    eventos?: number;
  };
}

export interface CreateInstituicaoDto {
  nome: string;
  slug: string;
  descricao?: string | null;
  logoUrl?: string | null;
}

export interface UpdateInstituicaoDto {
  nome?: string;
  slug?: string;
  descricao?: string | null;
  logoUrl?: string | null;
}

export interface InstituicaoFilterParams {
  busca?: string;
  ordenacao?: 'nome' | 'criadoEm';
  direcao?: 'asc' | 'desc';
}

