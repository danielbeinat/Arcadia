-- SQL Setup para AcademiaNova - VERSIÓN FINAL CORREGIDA
-- Compatible con tabla users que tiene ID tipo UUID y columnas exactas

-- PASO 1: Crear tabla de notificaciones para Realtime
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('APPROVAL', 'REJECTION', 'ANNOUNCEMENT', 'SYSTEM_MAINTENANCE', 'COURSE_UPDATE', 'ENROLLMENT', 'GRADE_UPDATE')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5)
);

-- PASO 2: Índices para notificaciones
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- PASO 3: Tabla de acciones administrativas para auditoría
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('STUDENT_APPROVAL', 'STUDENT_REJECTION', 'COURSE_CREATE', 'COURSE_UPDATE', 'COURSE_DELETE', 'USER_UPDATE', 'SYSTEM_CONFIG')),
    target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_resource_id TEXT,
    target_resource_type TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- PASO 4: Índices para admin_actions
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action_type ON admin_actions(action_type);

-- PASO 5: Tabla de métricas de performance
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL CHECK (metric_type IN ('page_load', 'api_call', 'user_action', 'error', 'search')),
    name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('ms', 'bytes', 'count', 'score')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    metadata JSONB
);

-- PASO 6: Índices para performance_metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session ON performance_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user ON performance_metrics(user_id);

-- PASO 7: Tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    page_views INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0,
    bounce_rate DECIMAL(3,2) DEFAULT 0.0,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 8: Índices para user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start_time ON user_sessions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);

-- PASO 9: Agregar columnas para búsqueda full-text a tablas existentes
ALTER TABLE users ADD COLUMN IF NOT EXISTS ts_vector tsvector;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS ts_vector tsvector;
ALTER TABLE degrees ADD COLUMN IF NOT EXISTS ts_vector tsvector;

-- PASO 10: Agregar columnas adicionales a courses para funcionalidades avanzadas
ALTER TABLE courses ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS modality TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_url TEXT;

-- PASO 11: Función para actualizar vectores de búsqueda en users (CORREGIDA)
CREATE OR REPLACE FUNCTION update_user_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_vector := to_tsvector('spanish',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW."lastName", '') || ' ' ||
        COALESCE(NEW.email, '') || ' ' ||
        COALESCE(NEW.program, '') || ' ' ||
        COALESCE(NEW.role, '') || ' ' ||
        COALESCE(NEW.degree, '') || ' ' ||
        COALESCE(NEW.country, '') || ' ' ||
        COALESCE(NEW.nationality, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 12: Función para actualizar vectores de búsqueda en courses
CREATE OR REPLACE FUNCTION update_course_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_vector := to_tsvector('spanish',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.code, '') || ' ' ||
        COALESCE(NEW.category, '') || ' ' ||
        COALESCE(NEW.level, '') || ' ' ||
        COALESCE(array_to_string(NEW.tags, ' '), '') || ' ' ||
        COALESCE(array_to_string(NEW.prerequisites, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 13: Función para actualizar vectores de búsqueda en degrees
CREATE OR REPLACE FUNCTION update_degree_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_vector := to_tsvector('spanish',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.faculty, '') || ' ' ||
        COALESCE(array_to_string(NEW.requirements, ' '), '') || ' ' ||
        COALESCE(array_to_string(NEW.subjects, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 14: Crear triggers para actualización automática de vectores de búsqueda
DROP TRIGGER IF EXISTS trigger_update_user_search_vector ON users;
CREATE TRIGGER trigger_update_user_search_vector
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_user_search_vector();

DROP TRIGGER IF EXISTS trigger_update_course_search_vector ON courses;
CREATE TRIGGER trigger_update_course_search_vector
    BEFORE INSERT OR UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_course_search_vector();

DROP TRIGGER IF EXISTS trigger_update_degree_search_vector ON degrees;
CREATE TRIGGER trigger_update_degree_search_vector
    BEFORE INSERT OR UPDATE ON degrees
    FOR EACH ROW EXECUTE FUNCTION update_degree_search_vector();

-- PASO 15: Crear índices GIN para búsqueda full-text
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING GIN(ts_vector);
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses USING GIN(ts_vector);
CREATE INDEX IF NOT EXISTS idx_degrees_search ON degrees USING GIN(ts_vector);

-- PASO 16: Funciones utilitarias para manejo de enrollments
CREATE OR REPLACE FUNCTION increment_course_students(course_id_param TEXT)
RETURNS void AS $$
BEGIN
    UPDATE courses
    SET "currentStudents" = "currentStudents" + 1,
        "updatedAt" = NOW()
    WHERE id = course_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_course_students(course_id_param TEXT)
RETURNS void AS $$
BEGIN
    UPDATE courses
    SET "currentStudents" = GREATEST("currentStudents" - 1, 0),
        "updatedAt" = NOW()
    WHERE id = course_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 17: Función para obtener resumen de performance de usuario
CREATE OR REPLACE FUNCTION get_user_performance_summary(user_uuid UUID)
RETURNS TABLE (
    total_sessions BIGINT,
    avg_session_duration NUMERIC,
    total_page_views BIGINT,
    avg_page_load_time NUMERIC,
    error_count BIGINT,
    search_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT us.session_id) as total_sessions,
        AVG(us.total_time_spent) as avg_session_duration,
        SUM(us.page_views) as total_page_views,
        AVG(CASE WHEN pm.metric_type = 'page_load' THEN pm.value END) as avg_page_load_time,
        COUNT(CASE WHEN pm.metric_type = 'error' THEN 1 END) as error_count,
        COUNT(CASE WHEN pm.metric_type = 'search' THEN 1 END) as search_count
    FROM user_sessions us
    LEFT JOIN performance_metrics pm ON us.session_id = pm.session_id
    WHERE us.user_id = user_uuid
    GROUP BY us.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 18: Habilitar Row Level Security en todas las tablas nuevas
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- PASO 19: Políticas de seguridad para notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark their notifications as read" ON notifications;
CREATE POLICY "Users can mark their notifications as read" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- PASO 20: Políticas de seguridad para admin_actions
DROP POLICY IF EXISTS "Only admins can view admin actions" ON admin_actions;
CREATE POLICY "Only admins can view admin actions" ON admin_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- PASO 21: Políticas de seguridad para performance_metrics
DROP POLICY IF EXISTS "Users can view their own metrics" ON performance_metrics;
CREATE POLICY "Users can view their own metrics" ON performance_metrics
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can insert metrics" ON performance_metrics;
CREATE POLICY "Anyone can insert metrics" ON performance_metrics
    FOR INSERT WITH CHECK (true);

-- PASO 22: Políticas de seguridad para user_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can insert sessions" ON user_sessions;
CREATE POLICY "Anyone can insert sessions" ON user_sessions
    FOR INSERT WITH CHECK (true);

-- PASO 23: Actualizar vectores de búsqueda para datos existentes (CORREGIDO)
UPDATE users SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE("lastName", '') || ' ' ||
    COALESCE(email, '') || ' ' ||
    COALESCE(program, '') || ' ' ||
    COALESCE(role, '') || ' ' ||
    COALESCE(degree, '') || ' ' ||
    COALESCE(country, '') || ' ' ||
    COALESCE(nationality, '')
) WHERE ts_vector IS NULL;

UPDATE courses SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(code, '') || ' ' ||
    COALESCE(category, '') || ' ' ||
    COALESCE(level, '') || ' ' ||
    COALESCE(array_to_string(tags, ' '), '') || ' ' ||
    COALESCE(array_to_string(prerequisites, ' '), '')
) WHERE ts_vector IS NULL;

UPDATE degrees SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(faculty, '') || ' ' ||
    COALESCE(array_to_string(requirements, ' '), '') || ' ' ||
    COALESCE(array_to_string(subjects, ' '), '')
) WHERE ts_vector IS NULL;

-- PASO 24: Actualizar categorías automáticamente en courses existentes
UPDATE courses SET
    category = CASE
        WHEN name ILIKE '%programacion%' OR name ILIKE '%software%' OR name ILIKE '%web%' OR name ILIKE '%javascript%' OR name ILIKE '%react%' THEN 'Tecnología'
        WHEN name ILIKE '%matematica%' OR name ILIKE '%calculo%' OR name ILIKE '%algebra%' OR name ILIKE '%estadistica%' THEN 'Matemáticas'
        WHEN name ILIKE '%administracion%' OR name ILIKE '%gestion%' OR name ILIKE '%negocios%' OR name ILIKE '%marketing%' THEN 'Negocios'
        WHEN name ILIKE '%diseno%' OR name ILIKE '%grafico%' OR name ILIKE '%arte%' THEN 'Diseño'
        WHEN name ILIKE '%ingles%' OR name ILIKE '%idioma%' OR name ILIKE '%lenguaje%' THEN 'Idiomas'
        WHEN name ILIKE '%historia%' OR name ILIKE '%filosofia%' OR name ILIKE '%sociologia%' THEN 'Humanidades'
        WHEN name ILIKE '%fisica%' OR name ILIKE '%quimica%' OR name ILIKE '%biologia%' THEN 'Ciencias'
        ELSE 'General'
    END,
    level = CASE
        WHEN name ILIKE '%basico%' OR name ILIKE '%introduccion%' OR name ILIKE '%fundamentos%' THEN 'beginner'
        WHEN name ILIKE '%intermedio%' OR name ILIKE '%medio%' THEN 'intermediate'
        WHEN name ILIKE '%avanzado%' OR name ILIKE '%superior%' THEN 'advanced'
        WHEN semester <= 2 THEN 'beginner'
        WHEN semester <= 4 THEN 'intermediate'
        ELSE 'advanced'
    END,
    modality = CASE
        WHEN classroom ILIKE '%virtual%' OR classroom ILIKE '%online%' THEN 'virtual'
        WHEN classroom ILIKE '%hibrido%' OR classroom ILIKE '%mixto%' THEN 'hibrido'
        ELSE 'presencial'
    END,
    tags = ARRAY[LOWER(name), LOWER(COALESCE(category, 'general'))]
WHERE category IS NULL OR level IS NULL OR modality IS NULL;

-- PASO 25: Vista para dashboard administrativo
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'STUDENT') as total_students,
    (SELECT COUNT(*) FROM users WHERE role = 'PROFESSOR') as total_professors,
    (SELECT COUNT(*) FROM users WHERE status = 'PENDIENTE') as pending_approvals,
    (SELECT COUNT(*) FROM courses WHERE status IS NOT NULL) as total_courses,
    (SELECT COUNT(*) FROM enrollments) as total_enrollments,
    (SELECT COUNT(*) FROM notifications WHERE read = false) as unread_notifications,
    (SELECT COUNT(*) FROM admin_actions WHERE created_at > NOW() - INTERVAL '24 hours') as recent_admin_actions;

-- PASO 26: Insertar notificación de demostración
INSERT INTO notifications (user_id, type, title, message, metadata) VALUES
((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 'ANNOUNCEMENT', '🎉 Sistema Actualizado', 'Se han implementado funcionalidades avanzadas: Notificaciones en tiempo real, búsqueda inteligente y analytics de performance.', '{"version": "2.0", "features": ["realtime", "search", "analytics"]}')
ON CONFLICT DO NOTHING;

-- PASO 27: Otorgar permisos necesarios
GRANT SELECT ON admin_dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION increment_course_students(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_course_students(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_performance_summary(UUID) TO authenticated;

-- PASO 28: Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Setup completado exitosamente!';
    RAISE NOTICE '🔔 Notificaciones en tiempo real: LISTO';
    RAISE NOTICE '🔍 Búsqueda full-text: LISTO';
    RAISE NOTICE '📊 Performance analytics: LISTO';
    RAISE NOTICE '🛡️ Row Level Security: LISTO';
    RAISE NOTICE '🎯 Compatible con UUIDs y nombres de columnas exactos';
    RAISE NOTICE '🚀 Tu proyecto está listo para impresionar a los recruiters!';
END $$;
