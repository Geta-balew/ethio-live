# Ethio Live — YouTube Monetization event

Landing page + Google sign-in registration (Gmail + phone) + admin dashboard.
Next.js 16 · Prisma 7 · Neon Postgres (`ethio-live` project, London) · better-auth.

## Pages
| Path | What |
|---|---|
| `/` | Landing page (EN/አማ), YouTube-style live player Day 1–3 |
| `/register` | Continue with Google → phone number → seat # + Telegram / Subscribe / Calendar |
| `/admin` | Registrations: stats, search, filter, inline edit, bulk status, delete, add manually, CSV export |
| `/admin/settings` | Dates, links, registration on/off, host, **all page text (EN & AM)** |

Admins = Google emails listed in `ADMIN_EMAILS` (comma-separated).

## Run locally
```
npm install
npm run dev        # http://localhost:3000
```
`.env.local` holds the secrets (see `.env.example`).

## Database changes
```
npx prisma migrate dev --name <change>   # local
npm run db:migrate                       # production
```

## Deploy (Vercel)
1. Push to GitHub, import in Vercel.
2. Add the env vars from `.env.example` (set `BETTER_AUTH_URL` to the real domain).
3. Google Cloud Console → OAuth client → add redirect URI `https://<domain>/api/auth/callback/google`.
4. Run `npm run db:migrate` once against production.
