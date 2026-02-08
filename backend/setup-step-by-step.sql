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

-- PASO 2: Crear índices para notificaciones
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- PASO 3: Crear tabla de métricas de performance
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

-- PASO 4: Crear índices para métricas
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);

-- PASO 5: Crear tabla de sesiones
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

-- PASO 6: Crear tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    level TEXT,
    credits INTEGER DEFAULT 3,
    duration TEXT,
    modality TEXT,
    department TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00,
    enrollment_count INTEGER DEFAULT 0,
    professor_name TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 7: Agregar columna de búsqueda a users
ALTER TABLE users ADD COLUMN IF NOT EXISTS ts_vector tsvector;

-- PASO 8: Agregar columna de búsqueda a courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS ts_vector tsvector;

-- PASO 9: Habilitar RLS en notificaciones
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PASO 10: Crear política para notificaciones
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- PASO 11: Habilitar RLS en courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- PASO 12: Crear política para courses
CREATE POLICY "Anyone can view active courses" ON courses
    FOR SELECT USING (status = 'ACTIVE');

-- PASO 13: Insertar datos de prueba en courses
INSERT INTO courses (name, description, category, level, tags) VALUES
('Programación Web', 'Aprende React y Node.js', 'Tecnología', 'advanced', ARRAY['react', 'nodejs']),
('Matemáticas', 'Fundamentos matemáticos', 'Matemáticas', 'intermediate', ARRAY['matemáticas', 'álgebra']),
('Marketing Digital', 'Estrategias de marketing', 'Negocios', 'beginner', ARRAY['marketing', 'seo'])
ON CONFLICT DO NOTHING;

-- PASO 14: Crear función para actualizar búsqueda en users
CREATE OR REPLACE FUNCTION update_user_search()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_vector := to_tsvector('spanish',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.lastname, '') || ' ' ||
        COALESCE(NEW.email, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 15: Crear trigger para users
DROP TRIGGER IF EXISTS user_search_trigger ON users;
CREATE TRIGGER user_search_trigger
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_user_search();

-- PASO 16: Actualizar vectores de búsqueda existentes en users
UPDATE users SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(lastname, '') || ' ' ||
    COALESCE(email, '')
) WHERE ts_vector IS NULL;

-- PASO 17: Crear función para actualizar búsqueda en courses
CREATE OR REPLACE FUNCTION update_course_search()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_vector := to_tsvector('spanish',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.category, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 18: Crear trigger para courses
DROP TRIGGER IF EXISTS course_search_trigger ON courses;
CREATE TRIGGER course_search_trigger
    BEFORE INSERT OR UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_course_search();

-- PASO 19: Actualizar vectores de búsqueda en courses
UPDATE courses SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(category, '')
) WHERE ts_vector IS NULL;

-- PASO 20: Crear índices de búsqueda
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING GIN(ts_vector);
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses USING GIN(ts_vector);
