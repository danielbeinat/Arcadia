-- SETUP SQL PARA PRODUCCIÓN - AcademiaNova
-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase

-- ============================================
-- 1. CREAR TABLAS PRINCIPALES
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'PROFESSOR', 'ADMIN')),
    program TEXT,
    status TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDIENTE', 'APROBADO', 'RECHAZADO')),

    -- Información adicional
    country TEXT,
    nationality TEXT,
    degree TEXT,
    semester INTEGER,
    gpa DECIMAL(3,2),
    credits INTEGER DEFAULT 0,

    -- Documentos
    "dniUrl" TEXT,
    "degreeUrl" TEXT,

    -- Información de contacto
    "docType" TEXT,
    "docNumber" TEXT,
    "phoneType" TEXT,
    "phonePrefix" TEXT,
    "phoneArea" TEXT,
    "phoneNumber" TEXT,
    "programType" TEXT,
    "startPeriod" TEXT,

    -- Timestamps
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "enrollmentDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de carreras
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

-- Tabla de cursos
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

-- Tabla de inscripciones
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DROPPED', 'COMPLETED')),
    grade DECIMAL(3,2),
    UNIQUE(user_id, course_id)
);

-- ============================================
-- 2. ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);

-- ============================================
-- 3. CONFIGURAR ROW LEVEL SECURITY
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. POLÍTICAS DE SEGURIDAD BÁSICAS
-- ============================================

-- Políticas para usuarios
DROP POLICY IF EXISTS "Public can read degrees" ON degrees;
CREATE POLICY "Public can read degrees" ON degrees
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read courses" ON courses;
CREATE POLICY "Public can read courses" ON courses
    FOR SELECT USING (true);

-- Permitir insertar usuarios (para registro)
DROP POLICY IF EXISTS "Anyone can create user account" ON users;
CREATE POLICY "Anyone can create user account" ON users
    FOR INSERT WITH CHECK (true);

-- Permitir a los usuarios ver su propio perfil
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Permitir a los usuarios actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Políticas para enrollments
DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own enrollments" ON enrollments;
CREATE POLICY "Users can create their own enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5. DATOS DE EJEMPLO
-- ============================================

-- Insertar admin por defecto
INSERT INTO users (email, name, "lastName", role, program, status) VALUES
('admin@academianova.com', 'Admin', 'Sistema', 'ADMIN', 'Administración', 'APROBADO')
ON CONFLICT (email) DO NOTHING;

-- Insertar algunas carreras
INSERT INTO degrees (name, description, duration, credits, faculty, requirements, subjects) VALUES
('Ingeniería en Sistemas', 'Formación integral en desarrollo de software y sistemas de información', 4, 240, 'Ingeniería',
 ARRAY['Bachillerato completo', 'Examen de admisión', 'Conocimientos básicos de matemáticas'],
 ARRAY['Programación I', 'Algoritmos y Estructuras de Datos', 'Base de Datos', 'Redes de Computadoras', 'Inteligencia Artificial']),

('Administración de Empresas', 'Gestión empresarial y liderazgo organizacional moderno', 4, 220, 'Ciencias Económicas',
 ARRAY['Bachillerato completo', 'Examen de admisión'],
 ARRAY['Contabilidad General', 'Marketing Estratégico', 'Finanzas Corporativas', 'Recursos Humanos', 'Estrategia Empresarial']),

('Psicología', 'Estudio del comportamiento humano y procesos mentales', 5, 300, 'Ciencias Humanas',
 ARRAY['Bachillerato completo', 'Examen psicométrico', 'Entrevista personal'],
 ARRAY['Psicología General', 'Neuropsicología', 'Psicología Clínica', 'Psicología Social', 'Metodología de Investigación']),

('Diseño Gráfico', 'Comunicación visual y diseño digital creativo', 3, 180, 'Bellas Artes',
 ARRAY['Bachillerato completo', 'Portfolio de trabajos'],
 ARRAY['Fundamentos del Diseño', 'Diseño Digital', 'Branding', 'Ilustración', 'Motion Graphics'])

ON CONFLICT (name) DO NOTHING;

-- Insertar algunos cursos
INSERT INTO courses (name, description, code, credits, semester, "maxStudents", classroom, schedule, prerequisites) VALUES
('Programación Web Avanzada', 'Desarrollo de aplicaciones web modernas con React, Node.js y bases de datos', 'CS301', 4, 6, 25, 'Lab A-201', 'Lunes y Miércoles 2:00-4:00 PM', ARRAY['Programación II', 'Base de Datos I']),

('Marketing Digital', 'Estrategias de marketing en el entorno digital y redes sociales', 'MKT201', 3, 4, 30, 'Aula B-105', 'Martes y Jueves 10:00-11:30 AM', ARRAY['Fundamentos de Marketing']),

('Cálculo I', 'Fundamentos del cálculo diferencial e integral', 'MAT101', 4, 1, 35, 'Aula C-302', 'Lunes, Miércoles y Viernes 8:00-9:00 AM', ARRAY[]),

('Diseño de Interfaces', 'Principios de UX/UI para aplicaciones web y móviles', 'DES201', 3, 4, 20, 'Lab D-101', 'Martes y Jueves 2:00-3:30 PM', ARRAY['Fundamentos del Diseño']),

('Psicología Organizacional', 'Comportamiento humano en el ámbito laboral y organizacional', 'PSI301', 3, 5, 25, 'Aula E-201', 'Miércoles y Viernes 4:00-5:30 PM', ARRAY['Psicología General', 'Psicología Social'])

ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 6. FUNCIONES UTILITARIAS
-- ============================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar automáticamente updatedAt en users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar automáticamente updatedAt en courses
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. VERIFICACIÓN FINAL
-- ============================================

-- Verificar que las tablas se crearon correctamente
DO $$
DECLARE
    user_count INTEGER;
    degree_count INTEGER;
    course_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO degree_count FROM degrees;
    SELECT COUNT(*) INTO course_count FROM courses;

    RAISE NOTICE '✅ Setup completado exitosamente!';
    RAISE NOTICE '👥 Usuarios creados: %', user_count;
    RAISE NOTICE '🎓 Carreras disponibles: %', degree_count;
    RAISE NOTICE '📚 Cursos disponibles: %', course_count;
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Tu aplicación está lista para usar en producción!';
    RAISE NOTICE '🔑 Usuario admin: admin@academianova.com';
    RAISE NOTICE '📝 Los estudiantes pueden registrarse y los admins pueden aprobarlos';
END $$;
