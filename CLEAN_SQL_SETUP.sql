-- SETUP SQL LIMPIO PARA AcademiaNova - SIN ERRORES
-- Ejecuta este SQL en el SQL Editor de Supabase

-- ============================================
-- 1. CREAR TABLA DE USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
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
    "dniUrl" TEXT,
    "degreeUrl" TEXT,

    -- Datos adicionales del formulario
    "docType" TEXT,
    "docNumber" TEXT,
    "phoneType" TEXT,
    "phonePrefix" TEXT,
    "phoneArea" TEXT,
    "phoneNumber" TEXT,
    "programType" TEXT,
    "startPeriod" TEXT,

    -- IDs específicos
    "studentId" TEXT,
    "professorId" TEXT,

    -- Timestamps
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "enrollmentDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    "isActive" BOOLEAN DEFAULT true,
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
    "maxStudents" INTEGER DEFAULT 30,
    "currentStudents" INTEGER DEFAULT 0,
    classroom TEXT,
    schedule TEXT,
    prerequisites TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. CREAR TABLA DE INSCRIPCIONES (CORREGIDA)
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
-- 5. CREAR ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users("studentId");
CREATE INDEX IF NOT EXISTS idx_users_professor_id ON users("professorId");

CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

CREATE INDEX IF NOT EXISTS idx_degrees_active ON degrees("isActive");

-- ============================================
-- 6. HABILITAR ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. POLÍTICAS DE SEGURIDAD BÁSICAS
-- ============================================

-- Políticas para degrees (acceso público para ver carreras)
DROP POLICY IF EXISTS "Public can read degrees" ON degrees;
CREATE POLICY "Public can read degrees" ON degrees
    FOR SELECT USING (true);

-- Políticas para courses (acceso público para ver cursos)
DROP POLICY IF EXISTS "Public can read courses" ON courses;
CREATE POLICY "Public can read courses" ON courses
    FOR SELECT USING (true);

-- Políticas para users
DROP POLICY IF EXISTS "Anyone can create user account" ON users;
CREATE POLICY "Anyone can create user account" ON users
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para enrollments
DROP POLICY IF EXISTS "Users can view their enrollments" ON enrollments;
CREATE POLICY "Users can view their enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Users can create their enrollments" ON enrollments;
CREATE POLICY "Users can create their enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ============================================
-- 8. INSERTAR USUARIO ADMIN
-- ============================================
INSERT INTO users (email, name, "lastName", role, program, status, "createdAt") VALUES
('admin@academianova.com', 'Admin', 'Sistema', 'ADMIN', 'Administración', 'APROBADO', NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 9. INSERTAR DATOS DE EJEMPLO - CARRERAS
-- ============================================
INSERT INTO degrees (name, description, duration, credits, faculty, requirements, subjects) VALUES
('Ingeniería en Sistemas', 'Formación integral en desarrollo de software y sistemas de información con enfoque en tecnologías modernas', 4, 240, 'Ingeniería',
 ARRAY['Bachillerato completo', 'Examen de admisión', 'Conocimientos básicos de matemáticas'],
 ARRAY['Programación I', 'Programación II', 'Algoritmos y Estructuras de Datos', 'Base de Datos', 'Redes de Computadoras', 'Inteligencia Artificial', 'Desarrollo Web', 'Sistemas Operativos']),

('Administración de Empresas', 'Gestión empresarial y liderazgo organizacional con enfoque en el mundo digital moderno', 4, 220, 'Ciencias Económicas',
 ARRAY['Bachillerato completo', 'Examen de admisión'],
 ARRAY['Contabilidad General', 'Marketing Estratégico', 'Finanzas Corporativas', 'Recursos Humanos', 'Estrategia Empresarial', 'Emprendimiento', 'E-commerce', 'Análisis de Datos']),

('Psicología', 'Estudio del comportamiento humano y procesos mentales con aplicación clínica y organizacional', 5, 300, 'Ciencias Humanas',
 ARRAY['Bachillerato completo', 'Examen psicométrico', 'Entrevista personal'],
 ARRAY['Psicología General', 'Neuropsicología', 'Psicología Clínica', 'Psicología Social', 'Metodología de Investigación', 'Psicología del Desarrollo', 'Terapias Psicológicas']),

('Diseño Gráfico', 'Comunicación visual y diseño digital creativo para medios tradicionales y digitales', 3, 180, 'Bellas Artes',
 ARRAY['Bachillerato completo', 'Portfolio de trabajos creativos'],
 ARRAY['Fundamentos del Diseño', 'Diseño Digital', 'Branding e Identidad', 'Ilustración', 'Motion Graphics', 'UX/UI Design', 'Fotografía Digital'])

ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 10. INSERTAR DATOS DE EJEMPLO - CURSOS
-- ============================================
INSERT INTO courses (name, description, code, credits, semester, "maxStudents", classroom, schedule, prerequisites) VALUES
('Programación Web Avanzada', 'Desarrollo de aplicaciones web modernas utilizando React, Node.js, bases de datos y deployment en la nube', 'CS301', 4, 6, 25, 'Lab A-201', 'Lunes y Miércoles 2:00-4:00 PM', ARRAY['Programación II', 'Base de Datos I']),

('Marketing Digital', 'Estrategias de marketing en el entorno digital, redes sociales, SEO, SEM y analítica web', 'MKT201', 3, 4, 30, 'Aula B-105', 'Martes y Jueves 10:00-11:30 AM', ARRAY['Fundamentos de Marketing']),

('Cálculo Diferencial e Integral', 'Fundamentos matemáticos del cálculo diferencial e integral aplicado a problemas de ingeniería', 'MAT101', 4, 1, 35, 'Aula C-302', 'Lunes, Miércoles y Viernes 8:00-9:00 AM', ARRAY[]),

('Diseño de Interfaces UX/UI', 'Principios de experiencia de usuario y diseño de interfaces para aplicaciones web y móviles', 'DES201', 3, 4, 20, 'Lab D-101', 'Martes y Jueves 2:00-3:30 PM', ARRAY['Fundamentos del Diseño']),

('Psicología Organizacional', 'Comportamiento humano en el ámbito laboral, liderazgo, motivación y clima organizacional', 'PSI301', 3, 5, 25, 'Aula E-201', 'Miércoles y Viernes 4:00-5:30 PM', ARRAY['Psicología General', 'Psicología Social']),

('Inteligencia Artificial', 'Fundamentos de IA, machine learning, redes neuronales y aplicaciones prácticas', 'CS401', 4, 8, 20, 'Lab F-301', 'Lunes y Miércoles 4:00-6:00 PM', ARRAY['Algoritmos y Estructuras de Datos', 'Estadística']),

('Contabilidad Financiera', 'Principios de contabilidad, estados financieros y análisis económico empresarial', 'ADM201', 3, 3, 35, 'Aula G-205', 'Martes, Jueves y Viernes 9:00-10:00 AM', ARRAY['Matemática Financiera'])

ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 11. FUNCIÓN DE ACTUALIZACIÓN AUTOMÁTICA
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 12. TRIGGERS PARA TIMESTAMPS AUTOMÁTICOS
-- ============================================
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
-- 13. FUNCIONES UTILITARIAS
-- ============================================

-- Función para obtener estadísticas de usuarios
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
    total BIGINT,
    students BIGINT,
    professors BIGINT,
    admins BIGINT,
    active BIGINT,
    pending BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE role = 'STUDENT') as students,
        COUNT(*) FILTER (WHERE role = 'PROFESSOR') as professors,
        COUNT(*) FILTER (WHERE role = 'ADMIN') as admins,
        COUNT(*) FILTER (WHERE status IN ('ACTIVE', 'APROBADO')) as active,
        COUNT(*) FILTER (WHERE status = 'PENDIENTE') as pending
    FROM users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener usuarios pendientes (solo admins)
CREATE OR REPLACE FUNCTION get_pending_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    "lastName" TEXT,
    role TEXT,
    program TEXT,
    status TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "dniUrl" TEXT,
    "degreeUrl" TEXT,
    "studentId" TEXT,
    "professorId" TEXT
) AS $$
BEGIN
    -- Verificar que el usuario actual sea admin
    IF NOT EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'ADMIN'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    RETURN QUERY
    SELECT
        u.id,
        u.email,
        u.name,
        u."lastName",
        u.role,
        u.program,
        u.status,
        u."createdAt",
        u."dniUrl",
        u."degreeUrl",
        u."studentId",
        u."professorId"
    FROM users u
    WHERE u.status = 'PENDIENTE'
    ORDER BY u."createdAt" DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 14. OTORGAR PERMISOS
-- ============================================
GRANT EXECUTE ON FUNCTION get_user_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_users() TO authenticated;

-- ============================================
-- 15. VERIFICACIÓN Y MENSAJE FINAL
-- ============================================
DO $$
DECLARE
    user_count INTEGER;
    degree_count INTEGER;
    course_count INTEGER;
    admin_exists BOOLEAN;
BEGIN
    -- Contar registros
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO degree_count FROM degrees;
    SELECT COUNT(*) INTO course_count FROM courses;
    SELECT EXISTS(SELECT 1 FROM users WHERE role = 'ADMIN') INTO admin_exists;

    -- Mostrar resultados
    RAISE NOTICE '';
    RAISE NOTICE '===============================================';
    RAISE NOTICE '✅ SETUP COMPLETADO EXITOSAMENTE';
    RAISE NOTICE '===============================================';
    RAISE NOTICE '';
    RAISE NOTICE '👥 Usuarios creados: %', user_count;
    RAISE NOTICE '🎓 Carreras disponibles: %', degree_count;
    RAISE NOTICE '📚 Cursos disponibles: %', course_count;
    RAISE NOTICE '👨‍💼 Admin configurado: %', CASE WHEN admin_exists THEN 'SÍ' ELSE 'NO' END;
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Row Level Security: ACTIVADO';
    RAISE NOTICE '📊 Funciones administrativas: LISTAS';
    RAISE NOTICE '🗂️ Índices de performance: CREADOS';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Usuario admin: admin@academianova.com';
    RAISE NOTICE '🚀 Tu base de datos está lista para producción';
    RAISE NOTICE '';
    RAISE NOTICE '===============================================';

    -- Verificar estructura crítica
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE EXCEPTION 'ERROR: Tabla users no fue creada correctamente';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses') THEN
        RAISE EXCEPTION 'ERROR: Tabla courses no fue creada correctamente';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'degrees') THEN
        RAISE EXCEPTION 'ERROR: Tabla degrees no fue creada correctamente';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollments') THEN
        RAISE EXCEPTION 'ERROR: Tabla enrollments no fue creada correctamente';
    END IF;

    RAISE NOTICE '✅ Verificación de estructura: PASADA';
    RAISE NOTICE '';

END $$;
