-- Users table
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- Posts table
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  description text,
  media_type text not null, -- image / video / audio / text / web
  media_url text,
  thumb_url text,
  like_count int default 0,
  comment_count int default 0,
  is_draft boolean default false,
  created_at timestamptz default now()
);

-- Tags table
create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  slug text unique not null,
  color text
);

-- PostTag (M:N)
create table if not exists public.post_tags (
  post_id uuid references public.posts(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Comments
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

-- Likes (POP-UP)
create table if not exists public.likes (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (post_id, user_id)
);

-- Follow
create table if not exists public.follows (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid references public.users(id) on delete cascade,
  following_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (follower_id, following_id)
);

-- Site Settings
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text,
  site_description text,
  site_url text,
  contact_email text,
  twitter text,
  github text,
  instagram text,
  updated_at timestamptz default now()
);

-- Insert default settings
insert into public.site_settings (site_name, site_description, site_url, contact_email)
values ('エンネク公式サイト', 'AI技術とデジタルマーケティングの最新情報をお届けします', 'https://example.com', 'contact@example.com')
on conflict do nothing;

-- Enable Row Level Security
alter table public.posts enable row level security;
alter table public.users enable row level security;
alter table public.site_settings enable row level security;

-- Policies for posts (公開記事は全員が閲覧可能、作成・更新・削除は認証ユーザーのみ)
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using (is_draft = false or auth.uid() is not null);

create policy "Authenticated users can create posts"
  on public.posts for insert
  with check (auth.uid() is not null);

create policy "Users can update their own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- Policies for users
create policy "Users are viewable by everyone"
  on public.users for select
  using (true);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- Policies for site_settings (認証ユーザーのみ閲覧・更新可能)
create policy "Authenticated users can view site settings"
  on public.site_settings for select
  using (auth.uid() is not null);

create policy "Authenticated users can update site settings"
  on public.site_settings for update
  using (auth.uid() is not null);

