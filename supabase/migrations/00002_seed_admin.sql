-- Create admin user in Supabase Auth
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_sso_user
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@sitara.go.id',
  crypt('Sitara2026!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin SITARA"}',
  false
) RETURNING id, email;

-- Create corresponding profile with super_admin role
INSERT INTO profiles (id, email, name, role, is_active)
SELECT id, email, raw_user_meta_data->>'name', 'super_admin', true
FROM auth.users
WHERE email = 'admin@sitara.go.id'
ON CONFLICT (id) DO NOTHING;
