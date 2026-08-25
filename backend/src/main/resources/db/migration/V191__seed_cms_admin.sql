INSERT INTO users (id, email, password_hash, first_name, last_name, role, current_xp, daily_streak)
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'admin@physiology.app', 
    '$2a$10$tZptE6xQ7F9P.41Z9G81gOuO36pGle8q2k/p7sJp3NnC1R.N3K0D2', -- Bcrypt for 'physiologyPassword123'
    'System', 
    'Admin', 
    'ADMIN', 
    0, 
    0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, password_hash, first_name, last_name, role, current_xp, daily_streak)
VALUES (
    '00000000-0000-0000-0000-000000000002', 
    'faculty@physiology.app', 
    '$2a$10$tZptE6xQ7F9P.41Z9G81gOuO36pGle8q2k/p7sJp3NnC1R.N3K0D2', -- Bcrypt for 'physiologyPassword123'
    'Medical', 
    'Faculty', 
    'FACULTY', 
    0, 
    0
) ON CONFLICT (id) DO NOTHING;
