-- DESACTIVAR RLS COMPLETAMENTE - SOLUCIÓN DEFINITIVA
-- Este SQL desactiva RLS por completo para que funcione el registro

-- ============================================
-- PASO 1: DESACTIVAR RLS EN TODAS LAS TABLAS
-- ============================================

ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS degrees DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS enrollments DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 2: ELIMINAR TODAS LAS POLÍTICAS
-- ============================================

-- Users policies
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Enable insert for registration" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Admin can update all users" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can create user account" ON users;

-- Other tables policies
DROP POLICY IF EXISTS "Allow public read on degrees" ON degrees;
DROP POLICY IF EXISTS "Allow public read on courses" ON courses;
DROP POLICY IF EXISTS "Public can read degrees" ON degrees;
DROP POLICY IF EXISTS "Public can read courses" ON courses;
DROP POLICY IF EXISTS "Allow authenticated operations on enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can view their enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can create their enrollments" ON enrollments;

-- ============================================
-- PASO 3: OTORGAR PERMISOS COMPLETOS
-- ============================================

-- Otorgar permisos a usuarios autenticados
GRANT ALL ON users TO authenticated;
GRANT ALL ON courses TO authenticated;
GRANT ALL ON degrees TO authenticated;
GRANT ALL ON enrollments TO authenticated;

-- Otorgar permisos a usuarios anónimos (para registro)
GRANT SELECT, INSERT ON users TO anon;
GRANT SELECT ON courses TO anon;
GRANT SELECT ON degrees TO anon;

-- ============================================
-- PASO 4: VERIFICAR ESTADO
-- ============================================

-- Verificar que las tablas existen y son accesibles
DO $$
DECLARE
    user_count INTEGER := 0;
    course_count INTEGER := 0;
    degree_count INTEGER := 0;
BEGIN
    BEGIN
        SELECT COUNT(*) INTO user_count FROM users;
        RAISE NOTICE '✅ Tabla users accesible: % registros', user_count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Error accediendo a users: %', SQLERRM;
    END;

    BEGIN
        SELECT COUNT(*) INTO course_count FROM courses;
        RAISE NOTICE '✅ Tabla courses accesible: % registros', course_count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Error accediendo a courses: %', SQLERRM;
    END;

    BEGIN
        SELECT COUNT(*) INTO degree_count FROM degrees;
        RAISE NOTICE '✅ Tabla degrees accesible: % registros', degree_count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Error accediendo a degrees: %', SQLERRM;
    END;

    RAISE NOTICE '';
    RAISE NOTICE '🔓 RLS COMPLETAMENTE DESACTIVADO';
    RAISE NOTICE '✅ Permisos otorgados a authenticated y anon';
    RAISE NOTICE '🚀 Registro de usuarios debería funcionar ahora';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  NOTA: Esto es temporal para desarrollo';
    RAISE NOTICE '🔒 Recuerda reactivar seguridad en producción';
END $$;

-- ============================================
-- PASO 5: MOSTRAR PERMISOS ACTUALES
-- ============================================

SELECT
    schemaname,
    tablename,
    tableowner,
    rowsecurity as rls_enabled,
    'RLS DISABLED' as security_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'courses', 'degrees', 'enrollments')
ORDER BY tablename;

-- ============================================
-- MENSAJE FINAL
-- ============================================

SELECT
    'RLS Completamente Desactivado' as status,
    'Registro habilitado sin restricciones' as access_level,
    'Temporal para desarrollo' as note,
    'Probar registro ahora' as next_step;
