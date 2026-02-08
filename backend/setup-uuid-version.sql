-- SQL Setup para AcademiaNova con UUID IDs (VERSIÓN CORREGIDA)
-- Compatible con tabla users que tiene ID tipo UUID

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

-- PASO 9: Tabla de cursos mejorada (compatible con tu estructura existente)
CREATE TABLE IF NOT EXISTS courses_enhanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_id TEXT,
    code TEXT,
    name TEXT NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    semester INTEGER,
    professor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    degree_id TEXT,
    schedule TEXT,
    classroom TEXT,
    max_students INTEGER DEFAULT 30,
    current_students INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE',
    prerequisites TEXT[],
    category TEXT,
    level TEXT,
    modality TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    price DECIMAL(10,2) DEFAULT 0.00,
    tags TEXT[],
    image_url TEXT,
    ts_vector tsvector,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 10: Tabla de inscripciones mejorada
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses_enhanced(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'COMPLETED', 'DROPPED', 'SUSPENDED')),
    grade DECIMAL(5,2),
    attendance DECIMAL(5,2),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_accessed TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- PASO 11: Índices para course_enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON course_enrollments(status);

-- PASO 12: Agregar columnas para búsqueda full-text a tablas existentes
ALTER TABLE users ADD COLUMN IF NOT EXISTS ts_vector tsvector;

-- Solo agregar ts_vector a tu tabla courses existente si no la tiene
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'ts_vector') THEN
        ALTER TABLE courses ADD COLUMN ts_vector tsvector;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'category') THEN
        ALTER TABLE courses ADD COLUMN category TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'level') THEN
        ALTER TABLE courses ADD COLUMN level TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'tags') THEN
        ALTER TABLE courses ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- PASO 13: Función para actualizar vectores de búsqueda en users
CREATE OR REPLACE FUNCTION update_user_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_vector := to_tsvector('spanish',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.lastname, '') || ' ' ||
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

-- PASO 14: Función para actualizar vectores de búsqueda en courses
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

-- PASO 15: Función para actualizar vectores de búsqueda en courses_enhanced
CREATE OR REPLACE FUNCTION update_course_enhanced_search_vector()
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

-- PASO 16: Crear triggers para actualización automática de vectores de búsqueda
DROP TRIGGER IF EXISTS trigger_update_user_search_vector ON users;
CREATE TRIGGER trigger_update_user_search_vector
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_user_search_vector();

DROP TRIGGER IF EXISTS trigger_update_course_search_vector ON courses;
CREATE TRIGGER trigger_update_course_search_vector
    BEFORE INSERT OR UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_course_search_vector();

DROP TRIGGER IF EXISTS trigger_update_course_enhanced_search_vector ON courses_enhanced;
CREATE TRIGGER trigger_update_course_enhanced_search_vector
    BEFORE INSERT OR UPDATE ON courses_enhanced
    FOR EACH ROW EXECUTE FUNCTION update_course_enhanced_search_vector();

-- PASO 17: Crear índices GIN para búsqueda full-text
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING GIN(ts_vector);
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses USING GIN(ts_vector) WHERE ts_vector IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_courses_enhanced_search ON courses_enhanced USING GIN(ts_vector);

-- PASO 18: Funciones utilitarias para manejo de enrollments
CREATE OR REPLACE FUNCTION increment_course_students(course_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE courses_enhanced
    SET current_students = current_students + 1,
        updated_at = NOW()
    WHERE id = course_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_course_students(course_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE courses_enhanced
    SET current_students = GREATEST(current_students - 1, 0),
        updated_at = NOW()
    WHERE id = course_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 19: Función para obtener resumen de performance de usuario
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

-- PASO 20: Habilitar Row Level Security en todas las tablas nuevas
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- PASO 21: Políticas de seguridad para notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark their notifications as read" ON notifications;
CREATE POLICY "Users can mark their notifications as read" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- PASO 22: Políticas de seguridad para admin_actions
DROP POLICY IF EXISTS "Only admins can view admin actions" ON admin_actions;
CREATE POLICY "Only admins can view admin actions" ON admin_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- PASO 23: Políticas de seguridad para performance_metrics
DROP POLICY IF EXISTS "Users can view their own metrics" ON performance_metrics;
CREATE POLICY "Users can view their own metrics" ON performance_metrics
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can insert metrics" ON performance_metrics;
CREATE POLICY "Anyone can insert metrics" ON performance_metrics
    FOR INSERT WITH CHECK (true);

-- PASO 24: Políticas de seguridad para user_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can insert sessions" ON user_sessions;
CREATE POLICY "Anyone can insert sessions" ON user_sessions
    FOR INSERT WITH CHECK (true);

-- PASO 25: Políticas de seguridad para courses_enhanced
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses_enhanced;
CREATE POLICY "Anyone can view active courses" ON courses_enhanced
    FOR SELECT USING (status = 'ACTIVE');

DROP POLICY IF EXISTS "Admins can manage courses" ON courses_enhanced;
CREATE POLICY "Admins can manage courses" ON courses_enhanced
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- PASO 26: Políticas de seguridad para course_enrollments
DROP POLICY IF EXISTS "Users can view their own enrollments" ON course_enrollments;
CREATE POLICY "Users can view their own enrollments" ON course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own enrollments" ON course_enrollments;
CREATE POLICY "Users can manage their own enrollments" ON course_enrollments
    FOR ALL USING (auth.uid() = user_id);

-- PASO 27: Actualizar vectores de búsqueda para datos existentes
UPDATE users SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(lastname, '') || ' ' ||
    COALESCE(email, '') || ' ' ||
    COALESCE(program, '') || ' ' ||
    COALESCE(role, '') || ' ' ||
    COALESCE(degree, '') || ' ' ||
    COALESCE(country, '') || ' ' ||
    COALESCE(nationality, '')
) WHERE ts_vector IS NULL;

-- Actualizar tu tabla courses existente si tiene ts_vector
UPDATE courses SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(code, '') || ' ' ||
    COALESCE(category, '') || ' ' ||
    COALESCE(level, '') || ' ' ||
    COALESCE(array_to_string(tags, ' '), '') || ' ' ||
    COALESCE(array_to_string(prerequisites, ' '), '')
) WHERE ts_vector IS NULL;

-- PASO 28: Migrar datos de tu tabla courses existente a courses_enhanced
INSERT INTO courses_enhanced (
    legacy_id, code, name, description, credits, semester,
    degree_id, schedule, classroom, max_students, current_students,
    status, prerequisites, category, level
)
SELECT
    id as legacy_id,
    code,
    name,
    description,
    credits,
    semester,
    degreeId as degree_id,
    schedule,
    classroom,
    maxStudents as max_students,
    currentStudents as current_students,
    status::text as status,
    prerequisites,
    CASE
        WHEN name ILIKE '%programacion%' OR name ILIKE '%software%' OR name ILIKE '%web%' THEN 'Tecnología'
        WHEN name ILIKE '%matematica%' OR name ILIKE '%calculo%' OR name ILIKE '%algebra%' THEN 'Matemáticas'
        WHEN name ILIKE '%administracion%' OR name ILIKE '%gestion%' OR name ILIKE '%negocios%' THEN 'Negocios'
        WHEN name ILIKE '%diseno%' OR name ILIKE '%arte%' THEN 'Diseño'
        WHEN name ILIKE '%ingles%' OR name ILIKE '%idioma%' THEN 'Idiomas'
        WHEN name ILIKE '%historia%' OR name ILIKE '%filosofia%' THEN 'Humanidades'
        WHEN name ILIKE '%fisica%' OR name ILIKE '%quimica%' OR name ILIKE '%biologia%' THEN 'Ciencias'
        ELSE 'General'
    END as category,
    CASE
        WHEN semester <= 2 THEN 'beginner'
        WHEN semester <= 4 THEN 'intermediate'
        ELSE 'advanced'
    END as level
FROM courses
WHERE NOT EXISTS (
    SELECT 1 FROM courses_enhanced WHERE legacy_id = courses.id
);

-- PASO 29: Vista para dashboard administrativo
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'STUDENT') as total_students,
    (SELECT COUNT(*) FROM users WHERE role = 'PROFESSOR') as total_professors,
    (SELECT COUNT(*) FROM users WHERE status = 'PENDIENTE') as pending_approvals,
    (SELECT COUNT(*) FROM courses_enhanced WHERE status = 'ACTIVE') as active_courses,
    (SELECT COUNT(*) FROM course_enrollments) as total_enrollments,
    (SELECT COUNT(*) FROM notifications WHERE read = false) as unread_notifications,
    (SELECT COUNT(*) FROM admin_actions WHERE created_at > NOW() - INTERVAL '24 hours') as recent_admin_actions;

-- PASO 30: Insertar datos de ejemplo en courses_enhanced si está vacía
INSERT INTO courses_enhanced (name, description, category, level, credits, tags)
SELECT 'Programación Web Avanzada', 'Curso de React y Node.js', 'Tecnología', 'advanced', 4, ARRAY['react', 'nodejs', 'javascript']
WHERE NOT EXISTS (SELECT 1 FROM courses_enhanced WHERE name = 'Programación Web Avanzada');

INSERT INTO courses_enhanced (name, description, category, level, credits, tags)
SELECT 'Matemáticas Discretas', 'Fundamentos matemáticos', 'Matemáticas', 'intermediate', 3, ARRAY['matemáticas', 'lógica']
WHERE NOT EXISTS (SELECT 1 FROM courses_enhanced WHERE name = 'Matemáticas Discretas');

-- PASO 31: Insertar notificación de demostración
INSERT INTO notifications (user_id, type, title, message, metadata) VALUES
((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 'ANNOUNCEMENT', '🎉 Sistema Actualizado', 'Se han implementado funcionalidades avanzadas: Notificaciones en tiempo real, búsqueda inteligente y analytics de performance.', '{"version": "2.0", "features": ["realtime", "search", "analytics"]}')
ON CONFLICT DO NOTHING;

-- PASO 32: Otorgar permisos necesarios
GRANT SELECT ON admin_dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION increment_course_students(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_course_students(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_performance_summary(UUID) TO authenticated;

-- PASO 33: Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Setup completado exitosamente!';
    RAISE NOTICE '🔔 Notificaciones en tiempo real: LISTO';
    RAISE NOTICE '🔍 Búsqueda full-text: LISTO';
    RAISE NOTICE '📊 Performance analytics: LISTO';
    RAISE NOTICE '🛡️ Row Level Security: LISTO';
    RAISE NOTICE '🎯 Compatible con UUIDs';
    RAISE NOTICE '📚 Tabla courses_enhanced creada con migración automática';
    RAISE NOTICE '🚀 Tu proyecto está listo para impresionar a los recruiters!';
END $$;
