-- RESET COMPLETO Y CREACIÓN DESDE CERO - AcademiaNova
-- Este SQL elimina todo y crea la base de datos desde cero

-- ============================================
-- PASO 1: LIMPIAR TODO (FORZAR)
-- ============================================

-- Desactivar RLS temporalmente para poder eliminar
ALTER TABLE IF EXISTS enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS degrees DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Public can read degrees" ON degrees;
DROP POLICY IF EXISTS "Public can read courses" ON courses;
DROP POLICY IF EXISTS "Anyone can create user account" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Users can view their enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can create their enrollments" ON enrollments;

-- Eliminar funciones
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_user_stats() CASCADE;
DROP FUNCTION IF EXISTS get_pending_users() CASCADE;

-- Eliminar tablas en orden correcto (por dependencias)
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS degrees CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- PASO 2: CREAR TABLAS DESDE CERO
-- ============================================

-- Crear tabla users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT',
    program TEXT,
    status TEXT NOT NULL DEFAULT 'PENDIENTE',

    -- Información adicional
    country TEXT,
    nationality TEXT,
    degree TEXT,
    semester INTEGER,
    gpa DECIMAL(3,2),
    credits INTEGER DEFAULT 0,

    -- URLs de documentos
    dniurl TEXT,
    degreeurl TEXT,

    -- Datos de contacto
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
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla degrees
CREATE TABLE degrees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    duration INTEGER DEFAULT 4,
    credits INTEGER DEFAULT 240,
    faculty TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    subjects TEXT[] DEFAULT '{}',
    isactive BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla courses
CREATE TABLE courses (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'ACTIVE',
    grade DECIMAL(3,2),
    UNIQUE(student_id, course_id)
);

-- ============================================
-- PASO 3: CONFIGURAR SEGURIDAD
-- ============================================

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Políticas para degrees (público)
CREATE POLICY "Public can read degrees" ON degrees
    FOR SELECT USING (true);

-- Políticas para courses (público)
CREATE POLICY "Public can read courses" ON courses
    FOR SELECT USING (true);

-- Políticas para users
CREATE POLICY "Anyone can create user account" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Política para que admins vean todos los usuarios
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid()
            AND admin_user.role = 'ADMIN'
        )
    );

-- Política para que admins actualicen cualquier usuario
CREATE POLICY "Admins can update any user" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid()
            AND admin_user.role = 'ADMIN'
        )
    );

-- Políticas para enrollments
CREATE POLICY "Users can view their enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can create their enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ============================================
-- PASO 4: INSERTAR DATOS INICIALES
-- ============================================

-- Usuario admin
INSERT INTO users (email, name, lastname, role, program, status, createdat)
VALUES ('admin@academianova.com', 'Admin', 'Sistema', 'ADMIN', 'Administración', 'APROBADO', NOW());

-- Carreras
INSERT INTO degrees (name, description, duration, credits, faculty, requirements, subjects) VALUES
('Ingeniería en Sistemas', 'Formación integral en desarrollo de software y tecnologías de la información', 4, 240, 'Ingeniería',
 ARRAY['Bachillerato completo', 'Examen de admisión', 'Matemáticas básicas'],
 ARRAY['Programación I', 'Programación II', 'Algoritmos', 'Base de Datos', 'Redes']),

('Administración de Empresas', 'Gestión empresarial moderna con enfoque digital', 4, 220, 'Ciencias Económicas',
 ARRAY['Bachillerato completo', 'Examen de admisión'],
 ARRAY['Contabilidad', 'Marketing', 'Finanzas', 'Recursos Humanos']),

('Psicología', 'Estudio del comportamiento humano y procesos mentales', 5, 300, 'Ciencias Humanas',
 ARRAY['Bachillerato completo', 'Examen psicométrico'],
 ARRAY['Psicología General', 'Neuropsicología', 'Psicología Clínica']),

('Diseño Gráfico', 'Comunicación visual y diseño digital creativo', 3, 180, 'Bellas Artes',
 ARRAY['Bachillerato completo', 'Portfolio de trabajos'],
 ARRAY['Fundamentos del Diseño', 'Diseño Digital', 'Branding', 'UX/UI']);

-- Cursos
INSERT INTO courses (name, description, code, credits, semester, maxstudents, classroom, schedule, prerequisites) VALUES
('Programación Web Avanzada', 'Desarrollo full-stack con React y Node.js', 'CS301', 4, 6, 25, 'Lab A-201', 'Lun/Mié 2-4 PM', ARRAY['Programación II']),
('Marketing Digital', 'Estrategias de marketing en el entorno digital', 'MKT201', 3, 4, 30, 'Aula B-105', 'Mar/Jue 10-11:30 AM', ARRAY['Marketing I']),
('Cálculo Diferencial', 'Fundamentos del cálculo diferencial', 'MAT101', 4, 1, 35, 'Aula C-302', 'Lun/Mié/Vie 8-9 AM', ARRAY[]),
('Diseño UX/UI', 'Experiencia de usuario y diseño de interfaces', 'DES201', 3, 4, 20, 'Lab D-101', 'Mar/Jue 2-3:30 PM', ARRAY['Diseño I']),
('Psicología Organizacional', 'Comportamiento humano en organizaciones', 'PSI301', 3, 5, 25, 'Aula E-201', 'Mié/Vie 4-5:30 PM', ARRAY['Psicología General']);

-- ============================================
-- PASO 5: CREAR ÍNDICES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- ============================================
-- PASO 6: MENSAJE DE CONFIRMACIÓN
-- ============================================

-- Mostrar estadísticas finales
SELECT
    '🎉 BASE DE DATOS CREADA EXITOSAMENTE' as mensaje,
    (SELECT COUNT(*) FROM users) as usuarios_creados,
    (SELECT COUNT(*) FROM degrees) as carreras_disponibles,
    (SELECT COUNT(*) FROM courses) as cursos_disponibles,
    (SELECT COUNT(*) FROM enrollments) as inscripciones,
    '✅ Todo listo para producción' as status;

-- Verificar usuario admin
SELECT
    'Admin creado: ' || email as verificacion_admin
FROM users
WHERE role = 'ADMIN'
LIMIT 1;
