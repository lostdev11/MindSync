## MindSync

Minimal setup guide for running and deploying MindSync.

### Environment variables

Define these environment variables (locally in `.env.local`, in production via the Vercel dashboard):

- **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase project URL, e.g. `https://your-project-id.supabase.co`.
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Your Supabase public anon key. This is safe to expose to the browser and is used by the client and server Supabase clients.
- **`OPENAI_API_KEY`**: Your OpenAI API key. **Do not prefix this with `NEXT_PUBLIC_` and do not expose it in client components.** It is only used in API routes (`app/api/recall` and `app/api/memory-timeline`).

You can copy `.env.example` to `.env.local` and fill in your real values:

```bash
cp .env.example .env.local
```

### Running locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create `.env.local`**

   ```bash
   cp .env.example .env.local
   # then edit .env.local with your Supabase + OpenAI keys
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

### Seeding demo data

MindSync expects at least these tables in your Supabase database:

- **`notes`**: used for personal knowledge and recall
  - Suggested columns: `id uuid primary key default gen_random_uuid()`, `user_id uuid`, `title text`, `content text`, `tags text[]`, `created_at timestamptz default now()`, `updated_at timestamptz`, `deleted_at timestamptz`.
- **`recall_queries`**: optional, used to log recall activity
  - Suggested columns: `id uuid primary key default gen_random_uuid()`, `user_id uuid`, `question text`, `answer text`, `note_ids uuid[]`, `created_at timestamptz default now()`.

To seed some demo notes for a single user, you can run a SQL snippet in the Supabase SQL editor (adjust table/column names to match your schema):

```sql
-- Replace this with an existing auth user id from your Supabase project
select '00000000-0000-0000-0000-000000000000'::uuid as demo_user_id;

insert into notes (user_id, title, content, tags)
values
  ('00000000-0000-0000-0000-000000000000', 'Welcome to MindSync', 'This is a demo note explaining how MindSync works.', '{getting-started}'),
  ('00000000-0000-0000-0000-000000000000', 'Project ideas', 'Brainstorming ideas for side projects and experiments.', '{projects,ideas}');
```

After seeding, authenticate as the corresponding Supabase user in your app and you should see data flowing into the recall and memory timeline features.

### Deploying on Vercel

- **Framework**: Next.js (App Router) – no custom Vercel config is required.
- **Build command**: `npm run build` (Vercel default for Next.js).
- **Output**: Next.js app (served by Vercel automatically).
- **Environment variables**: set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `OPENAI_API_KEY` in your Vercel project settings.

