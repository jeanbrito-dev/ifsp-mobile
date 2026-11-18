import { apiClient } from './client';
import {
  Instituicao,
  CreateInstituicaoDto,
  UpdateInstituicaoDto,
  InstituicaoFilterParams,
} from '../../types/instituicao';

export const instituicaoService = {
  async getAll(params?: InstituicaoFilterParams): Promise<Instituicao[]> {
    const response = await apiClient.get<Instituicao[]>('/instituicoes', {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<Instituicao> {
    const response = await apiClient.get<Instituicao>(`/instituicoes/${id}`);
    return response.data;
  },

  async getBySlug(slug: string): Promise<Instituicao> {
    const response = await apiClient.get<Instituicao>(`/instituicoes/slug/${slug}`);
    return response.data;
  },

  async create(data: CreateInstituicaoDto): Promise<Instituicao> {
    const response = await apiClient.post<Instituicao>('/instituicoes', data);
    return response.data;
  },

  async update(id: string, data: UpdateInstituicaoDto): Promise<Instituicao> {
    const response = await apiClient.patch<Instituicao>(`/instituicoes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/instituicoes/${id}`);
  },
};

