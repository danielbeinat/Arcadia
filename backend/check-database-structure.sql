-- Diagnóstico de Base de Datos - AcademiaNova
-- Ejecuta este SQL para ver qué tablas y columnas ya tienes

-- 1. Ver estructura de la tabla users
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 2. Ver si la tabla courses existe y su estructura
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'courses'
ORDER BY ordinal_position;

-- 3. Ver todas las tablas que tienes
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 4. Ver índices existentes
SELECT
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 5. Ver policies de Row Level Security
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
ORDER BY tablename, policyname;

-- 6. Ver triggers existentes
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 7. Contar registros en users
SELECT
    'users' as tabla,
    COUNT(*) as registros
FROM users;

-- 8. Ver roles de usuarios
SELECT
    role,
    COUNT(*) as cantidad
FROM users
GROUP BY role;

-- 9. Ver estados de usuarios
SELECT
    status,
    COUNT(*) as cantidad
FROM users
GROUP BY status;

-- 10. Ver si existe la tabla courses y cuántos registros tiene
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses')
        THEN 'EXISTS'
        ELSE 'NOT EXISTS'
    END as courses_table_status;

-- 11. Si courses existe, mostrar algunos datos
SELECT
    'courses' as tabla,
    COUNT(*) as registros
FROM courses
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses');
