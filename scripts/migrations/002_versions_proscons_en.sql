-- Neon / PostgreSQL: versiones y pros/contras en inglés (además de ES en columns existentes)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS versions_en jsonb;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS pros_cons_en jsonb;
