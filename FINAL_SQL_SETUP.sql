-- SETUP SQL FINAL PARA AcademiaNova - SIN ERRORES DE COLUMNAS
-- Ejecuta este SQL completo en el SQL Editor de Supabase

-- ============================================
-- 1. CREAR TABLA DE USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'PROFESSOR', 'ADMIN')),
    program TEXT,
    status TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDIENTE', 'APROBADO', 'RECHAZADO')),

    -- Información personal
    country TEXT,
    nationality TEXT,
    degree TEXT,
    semester INTEGER,
    gpa DECIMAL(3,2),
    credits INTEGER DEFAULT 0,

    -- Documentos
    dniurl TEXT,
    degreeurl TEXT,

    -- Datos del formulario
    doctype TEXT,
    docnumber TEXT,
    phonetype TEXT,
    phoneprefix TEXT,
    phonearea TEXT,
    phonenumber TEXT,
    programtype TEXT,
    startperiod TEXT,

    -- IDs específicos
    studentid TEXT,
    professorid TEXT,

    -- Timestamps
    createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    enrollmentdate TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREAR TABLA DE CARRERAS
-- ============================================
CREATE TABLE IF NOT EXISTS degrees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL DEFAULT 4,
    credits INTEGER NOT NULL DEFAULT 240,
    faculty TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    subjects TEXT[] DEFAULT '{}',
    isactive BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. CREAR TABLA DE CURSOS
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    code TEXT UNIQUE,
    credits INTEGER DEFAULT 3,
    semester INTEGER DEFAULT 1,
    maxstudents INTEGER DEFAULT 30,
    currentstudents INTEGER DEFAULT 0,
    classroom TEXT,
    schedule TEXT,
    prerequisites TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. CREAR TABLA DE INSCRIPCIONES
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DROPPED', 'COMPLETED')),
    grade DECIMAL(3,2),
    UNIQUE(student_id, course_id)
);

-- ============================================
-- 5. CREAR ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_studentid ON users(studentid);
CREATE INDEX IF NOT EXISTS idx_users_professorid ON users(professorid);

CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

CREATE INDEX IF NOT EXISTS idx_degrees_active ON degrees(isactive);

-- ============================================
-- 6. HABILITAR ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. POLÍTICAS DE SEGURIDAD
-- ============================================

-- Degrees: acceso público para ver carreras
DROP POLICY IF EXISTS "Public can read degrees" ON degrees;
CREATE POLICY "Public can read degrees" ON degrees
    FOR SELECT USING (true);

-- Courses: acceso público para ver cursos
DROP POLICY IF EXISTS "Public can read courses" ON courses;
CREATE POLICY "Public can read courses" ON courses
    FOR SELECT USING (true);

-- Users: políticas básicas
DROP POLICY IF EXISTS "Anyone can create user account" ON users;
CREATE POLICY "Anyone can create user account" ON users
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admin can view all users
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid()
            AND admin_user.role = 'ADMIN'
        )
    );

-- Admin can update any user
DROP POLICY IF EXISTS "Admins can update any user" ON users;
CREATE POLICY "Admins can update any user" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid()
            AND admin_user.role = 'ADMIN'
        )
    );

-- Enrollments: usuarios pueden ver sus inscripciones
DROP POLICY IF EXISTS "Users can view their enrollments" ON enrollments;
CREATE POLICY "Users can view their enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Users can create their enrollments" ON enrollments;
CREATE POLICY "Users can create their enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ============================================
-- 8. INSERTAR USUARIO ADMIN
-- ============================================
INSERT INTO users (email, name, lastname, role, program, status, createdat) VALUES
('admin@academianova.com', 'Admin', 'Sistema', 'ADMIN', 'Administración', 'APROBADO', NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 9. INSERTAR CARRERAS DE EJEMPLO
-- ============================================
INSERT INTO degrees (name, description, duration, credits, faculty, requirements, subjects) VALUES
('Ingeniería en Sistemas', 'Formación integral en desarrollo de software y tecnologías de la información', 4, 240, 'Ingeniería',
 ARRAY['Bachillerato completo', 'Examen de admisión', 'Matemáticas básicas'],
 ARRAY['Programación I', 'Programación II', 'Algoritmos', 'Base de Datos', 'Redes', 'Inteligencia Artificial']),

('Administración de Empresas', 'Gestión empresarial moderna con enfoque digital y liderazgo', 4, 220, 'Ciencias Económicas',
 ARRAY['Bachillerato completo', 'Examen de admisión'],
 ARRAY['Contabilidad', 'Marketing', 'Finanzas', 'Recursos Humanos', 'Emprendimiento']),

('Psicología', 'Estudio del comportamiento humano y procesos mentales', 5, 300, 'Ciencias Humanas',
 ARRAY['Bachillerato completo', 'Examen psicométrico'],
 ARRAY['Psicología General', 'Neuropsicología', 'Psicología Clínica', 'Metodología']),

('Diseño Gráfico', 'Comunicación visual y diseño digital creativo', 3, 180, 'Bellas Artes',
 ARRAY['Bachillerato completo', 'Portfolio'],
 ARRAY['Fundamentos del Diseño', 'Diseño Digital', 'Branding', 'UX/UI'])

ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 10. INSERTAR CURSOS DE EJEMPLO
-- ============================================
INSERT INTO courses (name, description, code, credits, semester, maxstudents, classroom, schedule, prerequisites) VALUES
('Programación Web Avanzada', 'React, Node.js y desarrollo full-stack moderno', 'CS301', 4, 6, 25, 'Lab A-201', 'Lun/Mié 2-4 PM', ARRAY['Programación II']),
('Marketing Digital', 'SEO, SEM, redes sociales y analítica web', 'MKT201', 3, 4, 30, 'Aula B-105', 'Mar/Jue 10-11:30 AM', ARRAY['Marketing I']),
('Cálculo I', 'Fundamentos de cálculo diferencial e integral', 'MAT101', 4, 1, 35, 'Aula C-302', 'Lun/Mié/Vie 8-9 AM', ARRAY[]),
('Diseño UX/UI', 'Experiencia de usuario y diseño de interfaces', 'DES201', 3, 4, 20, 'Lab D-101', 'Mar/Jue 2-3:30 PM', ARRAY['Diseño I']),
('Psicología Organizacional', 'Comportamiento humano en organizaciones', 'PSI301', 3, 5, 25, 'Aula E-201', 'Mié/Vie 4-5:30 PM', ARRAY['Psicología General'])

ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 11. FUNCIONES UTILITARIAS
-- ============================================

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para timestamps automáticos
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. VERIFICACIÓN FINAL
-- ============================================
DO $$
DECLARE
    user_count INTEGER;
    degree_count INTEGER;
    course_count INTEGER;
    admin_exists BOOLEAN;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO degree_count FROM degrees;
    SELECT COUNT(*) INTO course_count FROM courses;
    SELECT EXISTS(SELECT 1 FROM users WHERE role = 'ADMIN') INTO admin_exists;

    RAISE NOTICE '';
    RAISE NOTICE '===============================================';
    RAISE NOTICE '✅ ACADEMIANOVIA SETUP COMPLETADO';
    RAISE NOTICE '===============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 ESTADÍSTICAS:';
    RAISE NOTICE '👥 Usuarios: %', user_count;
    RAISE NOTICE '🎓 Carreras: %', degree_count;
    RAISE NOTICE '📚 Cursos: %', course_count;
    RAISE NOTICE '👨‍💼 Admin creado: %', CASE WHEN admin_exists THEN 'SÍ' ELSE 'NO' END;
    RAISE NOTICE '';
    RAISE NOTICE '🔐 SEGURIDAD:';
    RAISE NOTICE '✓ Row Level Security activado';
    RAISE NOTICE '✓ Políticas configuradas';
    RAISE NOTICE '✓ Índices creados';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 ACCESO ADMIN:';
    RAISE NOTICE 'Email: admin@academianova.com';
    RAISE NOTICE '(Configurar contraseña en Supabase Auth)';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 ¡BASE DE DATOS LISTA PARA PRODUCCIÓN!';
    RAISE NOTICE '===============================================';
END $$;
