-- SAFE SQL SETUP - Funcionalidades Avanzadas AcademiaNova
-- Este archivo maneja estructuras existentes de manera segura

-- PASO 1: Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- PASO 2: Índices para notificaciones
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- PASO 3: Tabla de métricas de performance
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    metadata JSONB
);

-- PASO 4: Índices para métricas
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);

-- PASO 5: Tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    page_views INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 6: Tabla de cursos SEGURA
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    level TEXT,
    credits INTEGER DEFAULT 3,
    duration TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00,
    enrollment_count INTEGER DEFAULT 0,
    professor_name TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 7: Agregar columnas opcionales a courses si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'category') THEN
        ALTER TABLE courses ADD COLUMN category TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'modality') THEN
        ALTER TABLE courses ADD COLUMN modality TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'department') THEN
        ALTER TABLE courses ADD COLUMN department TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'tags') THEN
        ALTER TABLE courses ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- PASO 8: Agregar columna de búsqueda a users si no existe
ALTER TABLE users ADD COLUMN IF NOT EXISTS ts_vector tsvector;

-- PASO 9: Agregar columna de búsqueda a courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS ts_vector tsvector;

-- PASO 10: Habilitar Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- PASO 11: Políticas de seguridad para notificaciones
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- PASO 12: Políticas para courses
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
CREATE POLICY "Anyone can view active courses" ON courses
    FOR SELECT USING (status = 'ACTIVE');

-- PASO 13: Políticas para performance metrics
DROP POLICY IF EXISTS "Users can view own metrics" ON performance_metrics;
CREATE POLICY "Users can view own metrics" ON performance_metrics
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can insert metrics" ON performance_metrics;
CREATE POLICY "Anyone can insert metrics" ON performance_metrics
    FOR INSERT WITH CHECK (true);

-- PASO 14: Políticas para user sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can insert sessions" ON user_sessions;
CREATE POLICY "Anyone can insert sessions" ON user_sessions
    FOR INSERT WITH CHECK (true);

-- PASO 15: Función para actualizar búsqueda en users
CREATE OR REPLACE FUNCTION update_user_search()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_vector := to_tsvector('spanish',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.lastname, '') || ' ' ||
        COALESCE(NEW.email, '') || ' ' ||
        COALESCE(NEW.program, '') || ' ' ||
        COALESCE(NEW.role, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 16: Trigger para users
DROP TRIGGER IF EXISTS user_search_trigger ON users;
CREATE TRIGGER user_search_trigger
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_user_search();

-- PASO 17: Función para actualizar búsqueda en courses
CREATE OR REPLACE FUNCTION update_course_search()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_vector := to_tsvector('spanish',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.category, '') || ' ' ||
        COALESCE(NEW.department, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 18: Trigger para courses
DROP TRIGGER IF EXISTS course_search_trigger ON courses;
CREATE TRIGGER course_search_trigger
    BEFORE INSERT OR UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_course_search();

-- PASO 19: Actualizar vectores de búsqueda existentes
UPDATE users SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(lastname, '') || ' ' ||
    COALESCE(email, '') || ' ' ||
    COALESCE(program, '') || ' ' ||
    COALESCE(role, '')
) WHERE ts_vector IS NULL;

-- PASO 20: Actualizar vectores de búsqueda en courses
UPDATE courses SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(category, '') || ' ' ||
    COALESCE(department, '')
) WHERE ts_vector IS NULL;

-- PASO 21: Crear índices de búsqueda
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING GIN(ts_vector);
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses USING GIN(ts_vector);

-- PASO 22: Insertar datos de prueba SEGUROS
DO $$
BEGIN
    -- Solo insertar si la tabla está vacía
    IF (SELECT COUNT(*) FROM courses) = 0 THEN
        INSERT INTO courses (name, description, level) VALUES
        ('Programación Web', 'Aprende React y Node.js', 'advanced'),
        ('Matemáticas Básicas', 'Fundamentos matemáticos', 'intermediate'),
        ('Marketing Digital', 'Estrategias de marketing online', 'beginner');
    END IF;
END $$;

-- PASO 23: Actualizar cursos existentes con categorías si están vacías
UPDATE courses SET
    category = CASE
        WHEN name ILIKE '%programacion%' OR name ILIKE '%web%' THEN 'Tecnología'
        WHEN name ILIKE '%matematica%' THEN 'Matemáticas'
        WHEN name ILIKE '%marketing%' THEN 'Negocios'
        ELSE 'General'
    END,
    tags = ARRAY[lower(name)]
WHERE category IS NULL AND ts_vector IS NULL;

-- PASO 24: Funciones utilitarias
CREATE OR REPLACE FUNCTION increment_course_students(row_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE courses
    SET enrollment_count = enrollment_count + 1,
        updated_at = NOW()
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_course_students(row_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE courses
    SET enrollment_count = GREATEST(enrollment_count - 1, 0),
        updated_at = NOW()
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 25: Insertar notificación de prueba
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Buscar un usuario admin
    SELECT id INTO admin_user_id FROM users WHERE role = 'ADMIN' LIMIT 1;

    -- Si existe un admin, crear notificación
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, type, title, message, metadata) VALUES
        (admin_user_id, 'ANNOUNCEMENT', '🎉 Sistema Actualizado', 'Funcionalidades avanzadas implementadas: Realtime, Búsqueda y Analytics', '{"version": "2.0"}')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- PASO 26: Permisos finales
GRANT EXECUTE ON FUNCTION increment_course_students(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_course_students(UUID) TO authenticated;
