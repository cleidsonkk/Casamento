# Wedding SaaS (Next.js + Prisma + Neon)

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS + componentes estilo shadcn/ui
- Prisma + Neon Postgres
- NextAuth (Credentials)
- Framer Motion, Recharts, Zod, QR Code Pix (BR Code), Upstash rate limit (fallback em memória DEV)

## Rotas
- Público: `/{slug}`, `/{slug}/rsvp`, `/{slug}/presentes`, `/{slug}/pix/{orderId}`
- Dashboard: `/dashboard`, `/dashboard/site`, `/dashboard/convidados`, `/dashboard/rsvp`, `/dashboard/presentes`, `/dashboard/pix`, `/dashboard/pedidos`
- Admin: `/admin`, `/admin/casais`, `/admin/templates`, `/admin/catalogo-presentes`, `/admin/logs`

## Setup local
1. Copie `.env.example` para `.env` e preencha `DATABASE_URL` (Neon recomendado).
2. Instale:
```bash
pnpm install
```
3. Prisma:
```bash
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm prisma:seed
```
4. Suba:
```bash
pnpm dev
```
5. Build:
```bash
pnpm build
```

## Credenciais seed
- Admin: `admin@weddingsaas.com` / `admin123`
- Casal demo: `casal@weddingsaas.com` / `casal123`
- Slug demo público: `/ana-e-bruno`

## Neon
1. Crie projeto no Neon.
2. Copie connection string pooled para `DATABASE_URL`.
3. Execute `pnpm prisma:migrate --name init` e `pnpm prisma:seed`.

## Vercel
1. Importe o repositório no Vercel.
2. Configure variáveis de ambiente (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `UPSTASH_*`, `CLOUDINARY_*`).
3. Build command: `pnpm build`.
4. Deploy.

## Regras implementadas
- RSVP restrito por padrão + passcode opcional
- Normalização de nomes para matching
- Honeypot anti-bot + rate limit RSVP/pedidos
- Reserva de presentes UNIQUE por 15 min
- Expiração automática para pedidos pendentes
- Pix BR Code com CRC16 em `lib/pix.ts`
- AuditLog em ações sensíveis (pix/pedidos/confirmações)

