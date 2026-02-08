-- Ejecuta en Supabase SQL Editor si los documentos (DNI/Analítico) no se muestran.
-- Añade las columnas dniurl y degreeurl a la tabla users.

ALTER TABLE users ADD COLUMN IF NOT EXISTS dniurl TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS degreeurl TEXT;
