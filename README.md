# IFSP Eventos Mobile

Aplicativo dos usuários do IFSP Eventos. Este diretório será o repositório independente `ifsp-eventos-mobile`; ele não compartilha `package.json`, branches ou pipeline com API/admin.

## Stack e responsabilidades

| Biblioteca | Uso |
| --- | --- |
| Expo + Expo Router | runtime e rotas por arquivos em `app/` |
| NativeWind | estilos utilitários e tema compartilhado |
| Axios | cliente HTTP único em `src/services/api/client.ts` |
| TanStack Query | cache, estados de carregamento e invalidação |
| React Hook Form + Zod | formulários e validação de entrada |
| Expo Secure Store | tokens e segredos locais; nunca AsyncStorage para tokens |

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

| Comando | Finalidade |
| --- | --- |
| `npm run lint` | regras Expo/ESLint |
| `npm run typecheck` | TypeScript sem emissão |
| `npm run format:check` | validação Prettier |
| `npm run format` | formatação automática |

## Branches planejadas

Crie todas a partir de `develop`, uma por PR, e só inicie a próxima quando o contrato da API necessário estiver definido.

| Branch | Escopo |
| --- | --- |
| `chore/mobile-project-setup` | ajustes de tooling e CI do aplicativo |
| `feature/auth-screens` | login, cadastro, recuperação e verificação de e-mail |
| `feature/auth-session` | Secure Store, sessão e proteção de rotas |
| `feature/home` | home e feed inicial |
| `feature/events-explore` | explorar, filtros e detalhes de eventos |
| `feature/event-comments` | comentários/chat e favoritos |
| `feature/institutions` | lista, detalhes e seguir instituições |
| `feature/ifsp-content` | Panorama, homenagens, calendário e documentos |
| `feature/profile` | perfil e configurações |
| `test/mobile-critical-flows` | testes dos fluxos críticos |

## ESTRUTURA FINAL DO APLICATIVO

Quando concluído, o app conterá landing, autenticação, home, explorar eventos, detalhes, comentários, instituições, seguidores, Panorama IFSP, homenagens, calendário acadêmico, editais/documentos, favoritos, perfil e configurações. Cada domínio terá rotas, componentes, serviços, tipos, validações e testes próprios.
