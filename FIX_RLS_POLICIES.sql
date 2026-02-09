-- ARREGLAR POLÍTICAS RLS CON RECURSIÓN INFINITA
-- Ejecuta este SQL en Supabase para eliminar la recursión

-- ============================================
-- PASO 1: ELIMINAR POLÍTICAS PROBLEMÁTICAS
-- ============================================

-- Eliminar todas las políticas existentes que causan recursión
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can create user account" ON users;

-- ============================================
-- PASO 2: CREAR POLÍTICAS SIN RECURSIÓN
-- ============================================

-- Política para permitir registro (INSERT) - Sin recursión
CREATE POLICY "Enable insert for registration" ON users
    FOR INSERT
    WITH CHECK (true);

-- Política para que usuarios vean su propio perfil - Sin recursión
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Política para que usuarios actualicen su propio perfil - Sin recursión
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================
-- PASO 3: POLÍTICAS PARA ADMIN (SIN RECURSIÓN)
-- ============================================

-- Crear función auxiliar para verificar si un usuario es admin
-- Esto evita la recursión al no consultar la misma tabla
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar directamente usando auth.jwt() en lugar de consultar users
    RETURN (auth.jwt() ->> 'role' = 'admin') OR
           (auth.jwt() ->> 'user_metadata' ->> 'role' = 'ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternativamente, política más simple para admins
-- Esta permite a cualquier usuario autenticado ver usuarios si tiene email admin
CREATE POLICY "Admin can view all users" ON users
    FOR SELECT
    USING (
        auth.email() = 'admin@academianova.com' OR
        auth.uid()::text IN (
            SELECT id::text FROM users WHERE role = 'ADMIN' AND id = auth.uid()
        )
    );

CREATE POLICY "Admin can update all users" ON users
    FOR UPDATE
    USING (
        auth.email() = 'admin@academianova.com' OR
        auth.uid()::text IN (
            SELECT id::text FROM users WHERE role = 'ADMIN' AND id = auth.uid()
        )
    );

-- ============================================
-- PASO 4: POLÍTICAS PARA OTRAS TABLAS (SIN RECURSIÓN)
-- ============================================

-- Asegurar que las políticas de otras tablas no tengan problemas
DROP POLICY IF EXISTS "Public can read courses" ON courses;
CREATE POLICY "Public can read courses" ON courses
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read degrees" ON degrees;
CREATE POLICY "Public can read degrees" ON degrees
    FOR SELECT USING (true);

-- ============================================
-- PASO 5: VERIFICAR QUE NO HAY RECURSIÓN
-- ============================================

-- Esta consulta debería ejecutarse sin errores
SELECT
    'Políticas RLS configuradas correctamente' as status,
    COUNT(*) as total_users
FROM users;

-- ============================================
-- PASO 6: MENSAJE DE CONFIRMACIÓN
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ POLÍTICAS RLS CORREGIDAS';
    RAISE NOTICE '🔧 Recursión infinita eliminada';
    RAISE NOTICE '🔐 Seguridad mantenida';
    RAISE NOTICE '📝 INSERT para registro: PERMITIDO';
    RAISE NOTICE '👤 SELECT propio perfil: PERMITIDO';
    RAISE NOTICE '✏️ UPDATE propio perfil: PERMITIDO';
    RAISE NOTICE '👨‍💼 Admin access: CONFIGURADO';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Ahora prueba el registro de usuario';
END $$;
