-- サイト設定を公開アクセス可能にする（誰でも閲覧可能、編集は管理者のみ）
drop policy if exists "Authenticated users can view site settings" on public.site_settings;

create policy "Site settings are viewable by everyone"
  on public.site_settings for select
  using (true);
