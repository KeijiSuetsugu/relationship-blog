-- UUID拡張機能の有効化（念のため）
create extension if not exists "uuid-ossp";

-- Site Settings テーブルの作成
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

-- RLSの有効化
alter table public.site_settings enable row level security;

-- 初期データの投入（データがない場合のみ）
insert into public.site_settings (site_name, site_description, site_url, contact_email)
select 'エンネク公式サイト', 'AI技術とデジタルマーケティングの最新情報をお届けします', 'https://example.com', 'contact@example.com'
where not exists (select 1 from public.site_settings);

-- ポリシーの設定（既存のポリシーがあれば一旦削除して再作成）
drop policy if exists "Authenticated users can view site settings" on public.site_settings;
drop policy if exists "Authenticated users can update site settings" on public.site_settings;
drop policy if exists "Site settings are viewable by everyone" on public.site_settings;

-- 閲覧は誰でも可能
create policy "Site settings are viewable by everyone"
  on public.site_settings for select
  using (true);

-- 更新はログインユーザーのみ
create policy "Authenticated users can update site settings"
  on public.site_settings for update
  using (auth.uid() is not null);
