export type TipoUsuario = 'USUARIO' | 'ADMIN';

export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: TipoUsuario;
  criadoEm?: string;
  atualizadoEm?: string | null;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
  confirmSenha?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  codigo: string;
  novaSenha: string;
  confirmNovaSenha?: string;
}

export interface ApiMessageResponse {
  message: string;
  success?: boolean;
}

export interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: RegisterCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}
