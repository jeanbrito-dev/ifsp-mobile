# IFSP Eventos Mobile

Aplicativo dos usuários do IFSP Eventos. Este diretório será o repositório independente `ifsp-eventos-mobile`; ele não compartilha `package.json`, branches ou pipeline com API/admin.

## Stack e responsabilidades

| Biblioteca            | Uso                                                      |
| --------------------- | -------------------------------------------------------- |
| Expo + Expo Router    | runtime e rotas por arquivos em `app/`                   |
| NativeWind            | estilos utilitários e tema compartilhado                 |
| Axios                 | cliente HTTP único em `src/services/api/client.ts`       |
| TanStack Query        | cache, estados de carregamento e invalidação             |
| React Hook Form + Zod | formulários e validação de entrada                       |
| Expo Secure Store     | tokens e segredos locais; nunca AsyncStorage para tokens |

## Instalação e execução

```powershell
Copy-Item .env.example .env
npm ci
npm start
```

Use `npm run android`, `npm run ios` ou `npm run web` conforme o alvo. Para dispositivo físico, `EXPO_PUBLIC_API_URL` deve apontar para o IP LAN da máquina que roda a API, por exemplo `http://192.168.0.10:3000/api`; `localhost` não funciona no celular. Nunca coloque token ou senha em variável `EXPO_PUBLIC_*`.

## Estrutura e onde escrever código

```text
app/                 rotas, layouts e grupos de navegação
src/components/ui/   controles genéricos e sem regra de negócio
src/components/shared/ componentes compostos reutilizáveis
src/features/        telas, hooks e lógica isolada por domínio
src/services/api/    cliente Axios e serviços HTTP por domínio
src/services/query/  QueryClient, keys e hooks de consulta/mutação
src/theme/           tokens globais
src/types/           tipos compartilhados
src/utils/           funções puras reutilizáveis
```

Não faça requisições dentro de componentes visuais. Uma feature deve expor hooks Query/Mutation; telas chamam esses hooks; serviços usam `apiClient`. Toda mutação deve invalidar as query keys relacionadas. Páginas vivem em `app/`; navegação comum é declarada em `_layout.tsx`.

## Convenções

- Arquivos: `kebab-case.ts`; componentes e tipos: `PascalCase`; hooks: `use-<nome>.ts`.
- Interfaces de API são tipadas; proíba `any`. Valide formulários com Zod antes de chamar serviços.
- Cores, fontes e espaçamentos não podem ser espalhados: use `tailwind.config.js` e `src/theme/tokens.ts`.
- Estados de carregamento, vazio, erro e acessibilidade são parte da entrega de cada tela.

## Scripts de qualidade

| Comando                | Finalidade             |
| ---------------------- | ---------------------- |
| `npm run lint`         | regras Expo/ESLint     |
| `npm run typecheck`    | TypeScript sem emissão |
| `npm run format:check` | validação Prettier     |
| `npm run format`       | formatação automática  |

## Branches planejadas

Crie todas a partir de `develop`, uma por PR, e só inicie a próxima quando o contrato da API necessário estiver definido.

| Branch                       | Escopo                                               |
| ---------------------------- | ---------------------------------------------------- |
| `chore/mobile-project-setup` | ajustes de tooling e CI do aplicativo                |
| `feature/auth-screens`       | login, cadastro, recuperação e verificação de e-mail |
| `feature/auth-session`       | Secure Store, sessão e proteção de rotas             |
| `feature/home`               | home e feed inicial                                  |
| `feature/events-explore`     | explorar, filtros e detalhes de eventos              |
| `feature/event-comments`     | comentários/chat e favoritos                         |
| `feature/institutions`       | lista, detalhes e seguir instituições                |
| `feature/ifsp-content`       | Panorama, homenagens, calendário e documentos        |
| `feature/profile`            | perfil e configurações                               |
| `test/mobile-critical-flows` | testes dos fluxos críticos                           |

## ESTRUTURA FINAL DO APLICATIVO

Quando concluído, o app conterá landing, autenticação, home, explorar eventos, detalhes, comentários, instituições, seguidores, Panorama IFSP, homenagens, calendário acadêmico, editais/documentos, favoritos, perfil e configurações. Cada domínio terá rotas, componentes, serviços, tipos, validações e testes próprios.

## Módulo de Autenticação (Documentação de Alterações)

Rotina completa de autenticação implementada cobrindo sessão segura via Expo Secure Store, controle de acesso e proteção de rotas com Expo Router, interceptores HTTP, validação de formulários com Zod e identidade visual oficial do IFSP.

### Arquivos Alterados

| Arquivo | Finalidade |
| --- | --- |
| `app/_layout.tsx` | Envolve a aplicação com `AuthProvider` e implementa `NavigationGuard` para proteção de rotas (redirecionamento automático entre `(auth)` e `(tabs)` com tela de carregamento). |
| `app/(tabs)/index.tsx` | Atualizado para exibir os dados do usuário autenticado (nome, e-mail, cargo) e botão para encerramento de sessão (`signOut`). |
| `src/services/api/client.ts` | Configuração de interceptores no Axios: injeção de `Authorization: Bearer <token>` a partir do SecureStore e tratamento de erro 401 (desconexão automática). |
| `.gitignore` | Inclusão de `.env` para proteção de dados locais e variáveis de ambiente. |

### Arquivos Criados

| Camada | Arquivos | Descrição |
| --- | --- | --- |
| **Tipos** | `src/types/auth.ts` | Interfaces TypeScript para usuário (`User`, `TipoUsuario`), credenciais, payloads e estado do contexto. |
| **Storage** | `src/services/storage/auth-storage.ts` | Gerenciamento de tokens (`accessToken`, `refreshToken`) e dados do usuário com `expo-secure-store` e fallback seguro para Web. |
| **Serviço HTTP** | `src/services/api/auth.service.ts` | Comunicação com os endpoints `/auth/login`, `/auth/register`, `/auth/me`, `/auth/forgot-password` e `/auth/reset-password`. |
| **TanStack Query** | `src/services/query/auth-keys.ts`<br>`src/features/auth/hooks/use-login.ts`<br>`src/features/auth/hooks/use-register.ts`<br>`src/features/auth/hooks/use-forgot-password.ts`<br>`src/features/auth/hooks/use-reset-password.ts`<br>`src/features/auth/hooks/use-auth.ts` | Chaves de cache padronizadas, hooks de mutação com invalidação de cache e hook utilitário de contexto. |
| **Contexto Global** | `src/contexts/auth-context.tsx` | Provedor de autenticação (`AuthProvider`) com inicialização assíncrona da sessão, sign-in, sign-up e sign-out. |
| **Validação** | `src/features/auth/validations/auth.schema.ts` | Schemas Zod (`loginSchema`, `registerSchema`, `forgotPasswordSchema`, `resetPasswordSchema`) com mensagens em português. |
| **Componentes UI** | `src/components/ui/button.tsx`<br>`src/components/ui/input.tsx` | Botão acessível (variantes, tamanhos, estados loading/disabled, tema IFSP) e campo de texto com label, erro e alternância de visibilidade de senha. |
| **Feature Components** | `src/features/auth/components/auth-header.tsx`<br>`src/features/auth/components/login-form.tsx`<br>`src/features/auth/components/register-form.tsx`<br>`src/features/auth/components/forgot-password-form.tsx`<br>`src/features/auth/components/reset-password-form.tsx` | Componentes de apresentação dos formulários com feedback de erros de rede/servidor e navegação entre etapas. |
| **Rotas (Expo Router)** | `app/(auth)/_layout.tsx`<br>`app/(auth)/login.tsx`<br>`app/(auth)/register.tsx`<br>`app/(auth)/forgot-password.tsx`<br>`app/(auth)/reset-password.tsx` | Rotas de tela cheia para Login, Cadastro, Esqueci Minha Senha e Redefinição de Senha com código. |

### Comandos para Inclusão em Branch

```powershell
cd ifsp-mobile

# Criar ou alternar para a branch desejada:
git checkout -b feature/auth-session

# Adicionar arquivos alterados e criados:
git add .gitignore README.md app/_layout.tsx "app/(tabs)/index.tsx" "app/(auth)/" src/

# Realizar o commit:
git commit -m "feat(auth): rotina completa de autenticacao, sessao segura e telas"
```

## Módulo de Instituições (Documentação de Alterações)

Implementação do módulo e formulário de cadastro de instituições baseado no model `Instituicao` do Prisma (`ifsp-api/prisma/schema.prisma`), projetado para alimentar o vínculo obrigatório nos cadastros de eventos da plataforma.

### Arquivos Alterados

| Arquivo | Finalidade |
| --- | --- |
| `src/components/ui/input.tsx` | Suporte aprimorado a campos multiline/textarea com alinhamento superior de ícones e texto. |
| `app/_layout.tsx` | Registro da rota de grupo `instituicoes` no Stack principal. |
| `app/(tabs)/index.tsx` | Adição de seção de atalho no dashboard inicial para cadastrar e listar instituições. |

### Arquivos Criados

| Camada | Arquivos | Descrição |
| --- | --- | --- |
| **Tipos** | `src/types/instituicao.ts` | Interfaces TypeScript para `Instituicao`, DTOs de criação/atualização e filtros baseados no schema Prisma. |
| **Utilitários** | `src/utils/slug.ts` | Geração automática e validação de slug a partir do nome da instituição (remoção de acentos e caracteres especiais). |
| **Serviço HTTP** | `src/services/api/instituicao.service.ts` | Métodos para criação (`POST /instituicoes`), listagem (`GET /instituicoes`), busca por id/slug e deleção. |
| **TanStack Query** | `src/services/query/instituicao-keys.ts`<br>`src/features/instituicoes/hooks/use-create-instituicao.ts`<br>`src/features/instituicoes/hooks/use-instituicoes.ts` | Chaves de cache hierárquicas, hook de mutação com invalidação automática de cache e hooks de listagem. |
| **Validação** | `src/features/instituicoes/validations/instituicao.schema.ts` | Schema Zod (`instituicaoSchema`) validando nome, slug único (regex e tamanho), descrição opcional e URL do logotipo. |
| **Feature Components** | `src/features/instituicoes/components/instituicao-header.tsx`<br>`src/features/instituicoes/components/instituicao-card.tsx`<br>`src/features/instituicoes/components/instituicao-form.tsx`<br>`src/features/instituicoes/components/instituicao-select.tsx` | Cabeçalho explicativo, card com prévia em tempo real, formulário com sincronização de slug e componente seletor integrado para formulários de eventos. |
| **Rotas (Expo Router)** | `app/instituicoes/_layout.tsx`<br>`app/instituicoes/cadastro.tsx`<br>`app/instituicoes/index.tsx` | Layout em Stack, tela de cadastro com formulário completo e tela de listagem/pesquisa de instituições. |

### Comandos para Inclusão na Branch `feature/institutions`

```powershell
cd ifsp-mobile

# Criar ou alternar para a branch planejada:
git checkout -b feature/institutions

# Adicionar arquivos alterados e criados:
git add README.md app/_layout.tsx "app/(tabs)/index.tsx" "app/instituicoes/" src/

# Realizar o commit:
git commit -m "feat(instituicoes): formulario de cadastro de instituicoes e integracao para eventos"
```


