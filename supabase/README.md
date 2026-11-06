# Backend Supabase — Temple Student Hub (demo)

Schema Postgres + dados de demonstração idênticos aos que hoje populam o app
(`src/data/seed`, `src/data/places.ts`, `src/data/assistantScripts.ts`). Tudo fictício.

| Arquivo | O que é |
|---|---|
| `migrations/20261106000000_init_schema.sql` | 44 tabelas, enums, índices, view `event_attendance`, RLS demo |
| `seed.sql` | Todos os dados (idempotente: limpa e recarrega) |
| `setup_all.sql` | schema + seed num arquivo só, para colar no SQL Editor |
| `scripts/generate-seed.mjs` | Regenera `seed.sql` a partir do seed TypeScript do app |

## Como aplicar
**SQL Editor:** abra o projeto no Supabase → SQL Editor → cole `setup_all.sql` → Run.

**CLI:** `supabase link --project-ref <ref>` e `supabase db push`, depois rode `seed.sql`.

Para voltar ao estado original da demo a qualquer momento, rode `seed.sql` de novo.

## Decisões de modelagem
- IDs de texto estáveis (`stu-jordan`, `post-1`…) para o front mapear sem conversão.
- Arrays e objetos aninhados do app viraram `text[]`/`jsonb` ou tabelas filhas
  (`inquiry_replies`, `collection_items`, `collaboration_files`, `founding_checklist`…).
- Stamps do Passport **não são armazenados**: continuam derivados das tabelas.
- Sem contadores públicos de seguidores (regra de produto).
- `demo_accounts` são personas (Jordan, Taylor, Morgan, Alex), nunca credenciais.

## Segurança
RLS está ligado, mas com política **aberta** (`demo_all`) para anon/authenticated, porque o app usa
personas e não login real. Antes de qualquer uso real, troque por políticas com `auth.uid()`.

## Regenerar o seed
Depois de mudar `src/data/**`: empacote e exporte o seed para JSON (esbuild) e rode
`node supabase/scripts/generate-seed.mjs seed.json supabase/seed.sql`.
