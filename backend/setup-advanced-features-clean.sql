-- Advanced Features SQL Schema for AcademiaNova
-- Execute this SQL in your Supabase SQL Editor after setup-supabase.sql

-- Create notifications table for real-time notifications
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

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create admin actions table for audit trail
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

-- Create indexes for admin actions
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action_type ON admin_actions(action_type);

-- Create performance metrics table
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

-- Create indexes for performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session ON performance_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user ON performance_metrics(user_id);

-- Create user sessions table
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

-- Create indexes for user sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start_time ON user_sessions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    credits INTEGER DEFAULT 3,
    duration TEXT,
    modality TEXT CHECK (modality IN ('presencial', 'virtual', 'hibrido')),
    department TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    enrollment_count INTEGER DEFAULT 0,
    max_students INTEGER DEFAULT 30,
    image_url TEXT,
    professor_name TEXT,
    professor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tags TEXT[],
    prerequisites TEXT[],
    learning_outcomes TEXT[],
    syllabus_url TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'DRAFT', 'ARCHIVED')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for courses
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_modality ON courses(modality);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating DESC);
CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN(tags);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'COMPLETED', 'DROPPED', 'SUSPENDED')),
    grade DECIMAL(5,2),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_accessed TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- Create indexes for enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON course_enrollments(status);

-- Create degrees table
CREATE TABLE IF NOT EXISTS degrees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    level TEXT CHECK (level IN ('associate', 'bachelor', 'master', 'doctorate')),
    duration TEXT,
    modality TEXT CHECK (modality IN ('presencial', 'virtual', 'hibrido')),
    department TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    total_credits INTEGER DEFAULT 120,
    image_url TEXT,
    requirements TEXT[],
    career_prospects TEXT[],
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'DRAFT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for degrees
CREATE INDEX IF NOT EXISTS idx_degrees_category ON degrees(category);
CREATE INDEX IF NOT EXISTS idx_degrees_level ON degrees(level);
CREATE INDEX IF NOT EXISTS idx_degrees_department ON degrees(department);
CREATE INDEX IF NOT EXISTS idx_degrees_status ON degrees(status);

-- Add search vector columns to existing tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS ts_vector tsvector;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS ts_vector tsvector;
ALTER TABLE degrees ADD COLUMN IF NOT EXISTS ts_vector tsvector;

-- Create function to update user search vectors
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

-- Create function to update course search vectors
CREATE OR REPLACE FUNCTION update_course_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_vector := to_tsvector('spanish',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.category, '') || ' ' ||
        COALESCE(NEW.department, '') || ' ' ||
        COALESCE(NEW.professor_name, '') || ' ' ||
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update degree search vectors
CREATE OR REPLACE FUNCTION update_degree_search_vector()
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

-- Create triggers for automatic search vector updates
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

-- Create GIN indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING GIN(ts_vector);
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses USING GIN(ts_vector);
CREATE INDEX IF NOT EXISTS idx_degrees_search ON degrees USING GIN(ts_vector);

-- Create utility functions
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

-- Enable RLS on new tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE degrees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications as read" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for admin actions
CREATE POLICY "Only admins can view admin actions" ON admin_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- Create RLS policies for performance metrics
CREATE POLICY "Users can view their own metrics" ON performance_metrics
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert metrics" ON performance_metrics
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for user sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert sessions" ON user_sessions
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for courses
CREATE POLICY "Anyone can view active courses" ON courses
    FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Admins can manage courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- Create RLS policies for course enrollments
CREATE POLICY "Users can view their own enrollments" ON course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own enrollments" ON course_enrollments
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for degrees
CREATE POLICY "Anyone can view active degrees" ON degrees
    FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Admins can manage degrees" ON degrees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- Insert sample courses for testing
INSERT INTO courses (name, description, category, level, credits, duration, modality, department, price, professor_name, tags) VALUES
('Programación Web Avanzada', 'Aprende React, Node.js y bases de datos modernas', 'Tecnología', 'advanced', 4, '4 meses', 'virtual', 'Ingeniería de Sistemas', 299.99, 'Dr. Carlos Mendez', ARRAY['react', 'nodejs', 'javascript', 'fullstack']),
('Matemáticas Discretas', 'Fundamentos matemáticos para ciencias de la computación', 'Matemáticas', 'intermediate', 3, '1 semestre', 'presencial', 'Matemáticas', 199.99, 'Prof. Ana García', ARRAY['matemáticas', 'lógica', 'algoritmos']),
('Marketing Digital', 'Estrategias de marketing en el mundo digital', 'Negocios', 'beginner', 3, '3 meses', 'hibrido', 'Administración', 249.99, 'Mg. Luis Rodríguez', ARRAY['marketing', 'social media', 'seo', 'analytics']),
('Diseño UX/UI', 'Diseño de experiencias de usuario modernas', 'Diseño', 'intermediate', 4, '5 meses', 'virtual', 'Diseño Gráfico', 349.99, 'Lic. María Fernández', ARRAY['ux', 'ui', 'figma', 'prototipado']),
('Inteligencia Artificial', 'Introducción a machine learning y deep learning', 'Tecnología', 'advanced', 5, '6 meses', 'virtual', 'Ingeniería de Sistemas', 499.99, 'Dr. Roberto Silva', ARRAY['ai', 'machine learning', 'python', 'tensorflow'])
ON CONFLICT DO NOTHING;

-- Insert sample degrees for testing
INSERT INTO degrees (name, description, category, level, duration, modality, department, total_credits, requirements) VALUES
('Ingeniería en Sistemas', 'Carrera enfocada en desarrollo de software y sistemas', 'Ingeniería', 'bachelor', '4 años', 'presencial', 'Ingeniería de Sistemas', 160, ARRAY['Título de bachiller', 'Examen de admisión', 'Certificado médico']),
('Licenciatura en Administración', 'Formación integral en gestión empresarial', 'Negocios', 'bachelor', '4 años', 'hibrido', 'Administración', 150, ARRAY['Título de bachiller', 'Examen de admisión']),
('Maestría en Marketing Digital', 'Especialización en estrategias digitales', 'Negocios', 'master', '2 años', 'virtual', 'Administración', 60, ARRAY['Título universitario', 'Experiencia laboral de 2 años']),
('Técnico en Diseño Gráfico', 'Carrera técnica en diseño visual', 'Diseño', 'associate', '2 años', 'presencial', 'Diseño Gráfico', 80, ARRAY['Título de bachiller', 'Portfolio de trabajos'])
ON CONFLICT DO NOTHING;

-- Insert sample notification for testing
INSERT INTO notifications (user_id, type, title, message, metadata) VALUES
((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 'ANNOUNCEMENT', '🎉 Sistema Mejorado', 'Hemos implementado notificaciones en tiempo real, búsqueda avanzada y monitoreo de rendimiento para mejorar tu experiencia.', '{"version": "2.0", "features": ["realtime", "search", "analytics"]}')
ON CONFLICT DO NOTHING;

-- Update search vectors for existing data
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

UPDATE courses SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(category, '') || ' ' ||
    COALESCE(department, '') || ' ' ||
    COALESCE(professor_name, '') || ' ' ||
    COALESCE(array_to_string(tags, ' '), '')
) WHERE ts_vector IS NULL;

UPDATE degrees SET ts_vector = to_tsvector('spanish',
    COALESCE(name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(category, '') || ' ' ||
    COALESCE(department, '')
) WHERE ts_vector IS NULL;

-- Create admin dashboard stats view
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'STUDENT') as total_students,
    (SELECT COUNT(*) FROM users WHERE role = 'PROFESSOR') as total_professors,
    (SELECT COUNT(*) FROM users WHERE status = 'PENDIENTE') as pending_approvals,
    (SELECT COUNT(*) FROM courses WHERE status = 'ACTIVE') as active_courses,
    (SELECT COUNT(*) FROM course_enrollments) as total_enrollments,
    (SELECT COUNT(*) FROM notifications WHERE read = false) as unread_notifications,
    (SELECT COUNT(*) FROM admin_actions WHERE created_at > NOW() - INTERVAL '24 hours') as recent_admin_actions;

-- Grant necessary permissions
GRANT SELECT ON admin_dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION increment_course_students(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_course_students(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_performance_summary(UUID) TO authenticated;
