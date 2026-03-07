-- The app auto-creates an admin on startup using DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD.
-- This optional seed is only needed when manually managing DB state.

INSERT INTO users (
    name,
    email,
    phone,
    password,
    language,
    region,
    is_admin,
    dark_mode,
    is_active
) VALUES (
    'Platform Admin',
    'admin@ott.local',
    '9999999999',
    '$2b$12$example.replace.with.real.bcrypt.hash',
    'English',
    'USA',
    TRUE,
    FALSE,
    TRUE
);

