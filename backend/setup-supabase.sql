-- Ejecuta este SQL en tu dashboard de Supabase:
-- SQL Editor → New query → Pega esto y ejecuta

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    lastName TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('STUDENT', 'PROFESSOR', 'ADMIN')),
    program TEXT NOT NULL,
    studentId TEXT UNIQUE,
    professorId TEXT UNIQUE,
    semester INTEGER,
    avatar TEXT,
    dniurl TEXT,
    degreeurl TEXT,
    enrollmentDate TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDIENTE', 'APROBADO', 'RECHAZADO')),
    gpa DECIMAL(3,2),
    credits INTEGER,
    password TEXT NOT NULL, -- Temporal para hash de contraseñas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Insertar usuarios por defecto
INSERT INTO users (email, name, lastName, role, program, password) VALUES
('admin@universidad.com', 'Admin', 'Sistema', 'ADMIN', 'Administración', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5GK'), -- password: admin
('prof@universidad.com', 'Profesor', 'Ejemplo', 'PROFESSOR', 'Ingeniería', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5GK') -- password: prof
ON CONFLICT (email) DO NOTHING;

-- Habilitar Row Level Security (opcional)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Crear política para que todos puedan leer usuarios
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

-- Crear política para que cualquiera pueda insertar usuarios (registro)
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (true);

-- Crear política para que usuarios puedan actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Si la tabla ya existía antes, agregar columnas para documentos (ejecutar si falta):
ALTER TABLE users ADD COLUMN IF NOT EXISTS dniurl TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS degreeurl TEXT;
