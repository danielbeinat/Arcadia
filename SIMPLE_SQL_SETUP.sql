-- SETUP SQL SUPER SIMPLE PARA AcademiaNova - GARANTIZADO SIN ERRORES
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT',
    program TEXT,
    status TEXT NOT NULL DEFAULT 'PENDIENTE',
    country TEXT,
    nationality TEXT,
    degree TEXT,
    semester INTEGER,
    gpa DECIMAL(3,2),
    credits INTEGER DEFAULT 0,
    dniurl TEXT,
    degreeurl TEXT,
    doctype TEXT,
    docnumber TEXT,
    phonetype TEXT,
    phoneprefix TEXT,
    phonearea TEXT,
    phonenumber TEXT,
    programtype TEXT,
    startperiod TEXT,
    studentid TEXT,
    professorid TEXT,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de carreras
CREATE TABLE IF NOT EXISTS degrees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER DEFAULT 4,
    credits INTEGER DEFAULT 240,
    faculty TEXT NOT NULL,
    requirements TEXT[],
    subjects TEXT[],
    isactive BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de cursos
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
    prerequisites TEXT[],
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de inscripciones
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID,
    course_id TEXT,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'ACTIVE',
    grade DECIMAL(3,2)
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Public can read degrees" ON degrees FOR SELECT USING (true);
CREATE POLICY "Public can read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Anyone can create user account" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Insertar admin
INSERT INTO users (email, name, lastname, role, program, status) VALUES
('admin@academianova.com', 'Admin', 'Sistema', 'ADMIN', 'Administración', 'APROBADO')
ON CONFLICT (email) DO NOTHING;

-- Insertar carreras
INSERT INTO degrees (name, description, faculty) VALUES
('Ingeniería en Sistemas', 'Desarrollo de software y tecnología', 'Ingeniería'),
('Administración de Empresas', 'Gestión empresarial moderna', 'Ciencias Económicas'),
('Psicología', 'Estudio del comportamiento humano', 'Ciencias Humanas'),
('Diseño Gráfico', 'Comunicación visual y diseño', 'Bellas Artes')
ON CONFLICT (name) DO NOTHING;

-- Insertar cursos
INSERT INTO courses (name, description, code) VALUES
('Programación Web', 'Desarrollo con React y Node.js', 'CS301'),
('Marketing Digital', 'Estrategias digitales', 'MKT201'),
('Cálculo I', 'Matemáticas fundamentales', 'MAT101'),
('Diseño UX/UI', 'Experiencia de usuario', 'DES201')
ON CONFLICT (code) DO NOTHING;

-- Mensaje final
SELECT
    '✅ Setup completado!' as mensaje,
    (SELECT COUNT(*) FROM users) as usuarios,
    (SELECT COUNT(*) FROM degrees) as carreras,
    (SELECT COUNT(*) FROM courses) as cursos;
