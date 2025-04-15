// This file contains the database schema for the AgentFlow application
// It can be used to set up the Supabase database tables

-- Users Table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null unique,
  name text not null,
  role text not null check (role in ('agent', 'broker', 'admin')),
  company text,
  stripe_customer_id text,
  team_id uuid references public.teams(id),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  last_active timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Teams Table
create table public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  broker_id uuid references public.users(id) not null,
  logo_url text,
  primary_color text,
  secondary_color text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.teams enable row level security;

-- Team Members Table
create table public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) not null,
  user_id uuid references public.users(id) not null,
  status text not null check (status in ('active', 'pending', 'inactive')),
  invited_at timestamp with time zone default now() not null,
  joined_at timestamp with time zone,
  unique(team_id, user_id)
);

-- Enable Row Level Security
alter table public.team_members enable row level security;

-- Content Generation Requests Table
create table public.content_generation_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  region text not null,
  audience text[] not null,
  goal text not null check (goal in ('leads', 'education', 'trust', 'referrals')),
  tone text not null check (tone in ('friendly', 'expert', 'educational', 'motivational')),
  created_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.content_generation_requests enable row level security;

-- Generated Contents Table
create table public.generated_contents (
  id uuid default uuid_generate_v4() primary key,
  request_id uuid references public.content_generation_requests(id) not null,
  user_id uuid references public.users(id) not null,
  social_posts text[] not null,
  story_ideas text[] not null,
  video_script text not null,
  cta_suggestions text[] not null,
  created_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.generated_contents enable row level security;

-- Subscriptions Table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  stripe_subscription_id text not null unique,
  plan text not null check (plan in ('solo', 'team-5', 'team-15', 'custom')),
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at_period_end boolean not null default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.subscriptions enable row level security;

-- Invoices Table
create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  stripe_invoice_id text not null unique,
  amount integer not null,
  currency text not null,
  status text not null check (status in ('paid', 'pending', 'failed')),
  invoice_url text,
  invoice_pdf text,
  created_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.invoices enable row level security;

-- Row Level Security Policies

-- Users: Users can read their own data, admins can read all
create policy "Users can read own data" on public.users
  for select using (auth.uid() = id or exists(select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Teams: Team members and admins can read
create policy "Team members can read" on public.teams
  for select using (
    exists(select 1 from public.team_members where team_id = id and user_id = auth.uid())
    or exists(select 1 from public.users where id = auth.uid() and role = 'admin')
    or broker_id = auth.uid()
  );

-- Team Members: Team members, team brokers, and admins can read
create policy "Team members can read own team" on public.team_members
  for select using (
    user_id = auth.uid()
    or exists(select 1 from public.teams where id = team_id and broker_id = auth.uid())
    or exists(select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Content Generation Requests: Users can read their own, brokers can read team members', admins can read all
create policy "Users can read own content requests" on public.content_generation_requests
  for select using (
    user_id = auth.uid()
    or exists(
      select 1 from public.teams t
      join public.team_members tm on t.id = tm.team_id
      where tm.user_id = public.content_generation_requests.user_id
      and t.broker_id = auth.uid()
    )
    or exists(select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Generated Contents: Users can read their own, brokers can read team members', admins can read all
create policy "Users can read own generated content" on public.generated_contents
  for select using (
    user_id = auth.uid()
    or exists(
      select 1 from public.teams t
      join public.team_members tm on t.id = tm.team_id
      where tm.user_id = public.generated_contents.user_id
      and t.broker_id = auth.uid()
    )
    or exists(select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Subscriptions: Users can read their own, admins can read all
create policy "Users can read own subscriptions" on public.subscriptions
  for select using (
    user_id = auth.uid()
    or exists(select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Invoices: Users can read their own, admins can read all
create policy "Users can read own invoices" on public.invoices
  for select using (
    user_id = auth.uid()
    or exists(select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Create functions for handling user creation and updates

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role, company)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'company');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to handle user updates
create or replace function public.handle_user_update()
returns trigger as $$
begin
  update public.users
  set updated_at = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for user updates
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_update();
