create table public.students (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (length(trim(first_name)) > 0),
  last_name text not null check (length(trim(last_name)) > 0),
  grade_level smallint not null check (grade_level between 1 and 12),
  created_at timestamptz not null default now()
);

-- RLS on with no policies: only the server (secret key) can read or write.
-- Browsers using the publishable/anon key get nothing.
alter table public.students enable row level security;
