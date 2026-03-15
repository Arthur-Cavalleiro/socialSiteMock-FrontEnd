# Social Site Mock — Frontend

Interface Next.js para o mock de rede social: listagem e CRUD de posts, usuário persistido e tema claro/escuro.

---

## Stack

| Tecnologia | Uso |
|------------|-----|
| **Next.js 16** | App Router, SSR/CSR |
| **React 19** | UI |
| **TypeScript** | Tipagem |
| **Tailwind CSS 4** | Estilos |
| **TanStack React Query** | Cache e mutações (posts) |
| **date-fns** | Formatação de datas |

---

## Variável de ambiente

A API do backend é acessada via URL configurável. Crie um arquivo **`.env.local`** na raiz do frontend:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/careers/
```

- **Obrigatória:** a aplicação lança erro em runtime se `NEXT_PUBLIC_API_URL` não estiver definida.
- O prefixo `NEXT_PUBLIC_` é necessário para expor a variável no browser.
- Em produção, use a URL do backend (ex.: `https://api.seudominio.com/careers/`).
- **Não commitar** `.env.local` — ela já está no `.gitignore` (`.env*`).

---

## Estrutura do projeto

```
frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx          # Root layout, fontes, Providers
│   ├── page.tsx             # Entrada: SignUp ou MainScreen
│   └── providers.tsx        # QueryClient + Theme + User
├── components/
│   ├── Button.tsx
│   ├── DeleteModal.tsx
│   ├── EditModal.tsx
│   ├── LogoutConfirmModal.tsx
│   ├── MainScreen.tsx       # Lista de posts, formulário, modais
│   ├── PostCard.tsx
│   ├── SignUpModal.tsx
│   └── ThemeToggle.tsx
├── context/
│   ├── ThemeContext.tsx     # Tema light/dark + localStorage
│   └── UserContext.tsx      # Username + localStorage
├── lib/
│   ├── api.ts               # getPosts, createPost, updatePost, deletePost
│   └── types.ts             # Interface Post
├── public/
├── .env.local               # (não versionado) NEXT_PUBLIC_API_URL
├── package.json
└── README.md
```

---

## Arquitetura

### Fluxo de entrada

1. **`layout.tsx`** — Carrega fontes (Geist) e envolve a árvore em `<Providers>`.
2. **`providers.tsx`** — Encadeia: `QueryClientProvider` → `ThemeProvider` → `UserProvider`.
3. **`page.tsx`** — Se não houver usuário em contexto, exibe `SignUpModal`; caso contrário, exibe `MainScreen`.

### Camadas

| Camada | Responsabilidade |
|--------|-------------------|
| **app/** | Rotas e layout; página inicial decide entre sign-up e tela principal. |
| **context/** | Estado global: tema (light/dark) e username; persistência em `localStorage`. |
| **lib/** | Cliente HTTP (fetch) e tipos; base URL da API via `NEXT_PUBLIC_API_URL`. |
| **components/** | UI: modais (sign-up, editar, excluir, logout), lista de posts, formulário de novo post, toggle de tema. |

### Contextos

- **UserContext** — `username` (ou `null`). Hydratação a partir de `localStorage` (`codeleap_username`) para evitar flash; `setUsername` e `logout` atualizam estado e storage.
- **ThemeContext** — `theme` (light/dark), `setTheme`, `toggleTheme`. Valor persistido em `localStorage` (`codeleap_theme`); uso de `useSyncExternalStore` para compatibilidade com SSR; classe `dark` em `<html>` para Tailwind.

### Dados (posts)

- **TanStack Query** — Listagem com `useQuery` (queryKey `["posts"]`); create/update/delete com `useMutation` e `invalidateQueries` para refetch.
- **lib/api.ts** — Funções que chamam o backend: `getPosts`, `createPost`, `updatePost`, `deletePost`. Base URL normalizada (com barra final).

---

## Implementações principais

- **Sign-up** — Modal para informar username; salvo em contexto e `localStorage`; sem backend de auth (mock).
- **Listagem de posts** — Cards com título, conteúdo, autor, data (formatada com date-fns); loading e lista vazia tratados.
- **Criar post** — Formulário (título + conteúdo); username vem do contexto; mutation e invalidação da lista.
- **Editar post** — Modal com título e conteúdo editáveis; PATCH no backend; apenas título e conteúdo alteráveis.
- **Excluir post** — Modal de confirmação; DELETE no backend; lista atualizada após sucesso.
- **Logout** — Modal de confirmação; limpa username no contexto e no `localStorage`; volta para o sign-up.
- **Tema** — Toggle light/dark; persistido; classe `dark` no documento para estilos Tailwind.

---

## Como rodar

```bash
cd frontend
# Crie .env.local com NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/careers/
npm install
npm run dev
```

Acesse `http://localhost:3000`. O backend deve estar rodando na URL configurada em `NEXT_PUBLIC_API_URL` (ex.: `http://127.0.0.1:8000/careers/`).

Build para produção:

```bash
npm run build
npm start
```
