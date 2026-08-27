# Siam Si

Mobile fortune-stick web app with a Next.js frontend foundation and Supabase backend.

## Backend Setup

1. Create a Supabase project.
2. Copy the project URL and anon key from Supabase project settings.
3. Create `.env.local` from `.env.example`.
4. Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it in browser code and never commit `.env.local`.

## Install And Run

```bash
npm install
npm run dev
```

The app uses Next.js App Router. The existing mobile prototype is preserved and loaded through the Next shell while backend routes and Supabase utilities are added underneath.

## Supabase Database

Run the SQL migration in:

```text
supabase/migrations/20260827160000_initial_backend.sql
```

Then seed development data with:

```text
supabase/seed.sql
```

The schema creates:

- `profiles`
- `categories`
- `temples`
- `temple_categories`
- `fortune_sets`
- `fortunes`
- `fortune_history`
- `nfc_cards`
- `temple-images` storage bucket

All application tables have Row Level Security enabled. User-sensitive tables are scoped with `auth.uid()`.

## Auth

Supabase Auth handles email/password credentials. The app includes route handlers for:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

New Supabase users get a matching `profiles` record from a database trigger. Passwords are not stored in app tables.

## Fortune Draw API

Authenticated users draw fortunes through:

```text
POST /api/fortune/draw
```

Body:

```json
{
  "templeId": "ai-khai-wat-chedi"
}
```

The route verifies the current Supabase session, resolves the selected active temple, chooses from its active fortune set with server-side crypto randomness, saves `fortune_history`, and returns a safe response without secrets.

## Vercel Deploy

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Add the same environment variables from `.env.example` in Vercel Project Settings.
4. Deploy.

Do not add `SUPABASE_SERVICE_ROLE_KEY` to any public client-side config.

## Testing Checklist

- User can register.
- User can login.
- Session persists after refresh.
- User can logout.
- Public visitor can browse temples.
- Public visitor cannot draw a fortune.
- Authenticated user can draw a fortune.
- Fortune comes from the selected temple's active set.
- Fortune draw creates a `fortune_history` record.
- User can only read their own history.
- Invalid temple returns a safe error.
- Repeated shake events should be locked on the client before calling the draw API again.
- Service role key is not exposed to the browser bundle.

