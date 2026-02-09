# 🚀 Guía Rápida de Deployment - AcademiaNova

## ⚡ Quick Start (5 minutos)

### 1. Configurar Supabase
```bash
# 1. Crear proyecto en supabase.com
# 2. Copiar URL y ANON_KEY del dashboard
# 3. Ejecutar SQL setup (ver abajo)
```

### 2. Variables de Entorno
Crear `frontend/.env`:
```env
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Deploy en Netlify
```bash
# Build settings:
Base directory: frontend
Build command: npm install && npm run build
Publish directory: frontend/dist
```

---

## 📋 Paso a Paso Detallado

### PASO 1: Setup Supabase (2 min)

1. **Crear proyecto**: [supabase.com](https://supabase.com) → New Project
2. **Configurar región**: South America (menor latencia)
3. **Obtener credenciales**:
   - Settings → API → Project URL
   - Settings → API → anon public key

### PASO 2: Base de Datos (3 min)

Ejecutar en SQL Editor de Supabase:

```sql
-- 1. Setup básico de tablas
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('STUDENT', 'PROFESSOR', 'ADMIN')),
    program TEXT NOT NULL,
    status TEXT DEFAULT 'PENDIENTE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDIENTE', 'APROBADO', 'RECHAZADO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tablas adicionales
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    code TEXT UNIQUE,
    credits INTEGER DEFAULT 3,
    semester INTEGER,
    "maxStudents" INTEGER DEFAULT 30,
    "currentStudents" INTEGER DEFAULT 0,
    classroom TEXT,
    schedule TEXT,
    prerequisites TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS degrees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    credits INTEGER NOT NULL,
    faculty TEXT NOT NULL,
    requirements TEXT[],
    subjects TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DROPPED', 'COMPLETED')),
    grade DECIMAL(3,2),
    UNIQUE(user_id, course_id)
);

-- 3. Crear usuario admin por defecto
INSERT INTO users (email, name, "lastName", role, program, status) VALUES
('admin@academianova.com', 'Admin', 'Sistema', 'ADMIN', 'Administración', 'APROBADO')
ON CONFLICT (email) DO NOTHING;

-- 4. Datos de ejemplo
INSERT INTO degrees (name, description, duration, credits, faculty, requirements, subjects) VALUES
('Ingeniería en Sistemas', 'Formación integral en desarrollo de software y sistemas', 4, 240, 'Ingeniería', 
 ARRAY['Bachillerato completo', 'Examen de admisión', 'Conocimientos básicos de matemáticas'], 
 ARRAY['Programación I', 'Algoritmos', 'Base de Datos', 'Redes', 'Inteligencia Artificial']),
('Administración de Empresas', 'Gestión empresarial y liderazgo organizacional', 4, 220, 'Ciencias Económicas',
 ARRAY['Bachillerato completo', 'Examen de admisión'], 
 ARRAY['Contabilidad', 'Marketing', 'Finanzas', 'Recursos Humanos', 'Estrategia Empresarial'])
ON CONFLICT DO NOTHING;

INSERT INTO courses (name, description, code, credits, semester, "maxStudents", classroom, schedule, prerequisites) VALUES
('Programación Web Avanzada', 'Desarrollo de aplicaciones web modernas con React y Node.js', 'CS301', 4, 6, 25, 'Lab A-201', 'Lunes y Miércoles 2:00-4:00 PM', ARRAY['Programación II']),
('Marketing Digital', 'Estrategias de marketing en el entorno digital', 'MKT201', 3, 4, 30, 'Aula B-105', 'Martes y Jueves 10:00-11:30 AM', ARRAY['Fundamentos de Marketing'])
ON CONFLICT DO NOTHING;

-- 5. Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- 6. Políticas básicas
CREATE POLICY "Public read access for degrees" ON degrees FOR SELECT USING (true);
CREATE POLICY "Public read access for courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
```

### PASO 3: Storage (1 min)

1. Ve a Storage en Supabase
2. Create bucket: `documents`
3. Configuración:
   - Public bucket: ✅ (para facilitar acceso)
   - File size limit: 5MB

### PASO 4: Deploy Frontend (2 min)

#### Opción A: GitHub + Netlify (Recomendado)
1. Push tu código a GitHub
2. [netlify.com](https://netlify.com) → Import from Git
3. Configurar:
   ```
   Base directory: frontend
   Build command: npm install && npm run build
   Publish directory: frontend/dist
   ```
4. Environment variables:
   ```
   VITE_SUPABASE_URL = tu-supabase-url
   VITE_SUPABASE_ANON_KEY = tu-anon-key
   ```

#### Opción B: Manual Build
```bash
cd frontend
npm install
npm run build
# Subir carpeta dist/ a tu hosting
```

---

## ✅ Checklist Final

- [ ] ✅ Supabase proyecto creado
- [ ] ✅ SQL ejecutado (users, courses, degrees, enrollments)
- [ ] ✅ Storage bucket "documents" creado
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Deploy en Netlify exitoso
- [ ] ✅ URL de producción funcionando

## 🧪 Testing Post-Deploy

### URLs a probar:
- `https://tu-app.netlify.app/` - Homepage
- `https://tu-app.netlify.app/login` - Login
- `https://tu-app.netlify.app/inscripciones` - Registro
- `https://tu-app.netlify.app/dashboard` - Dashboard (requiere login)

### Funcionalidades clave:
- [ ] **Registro**: Crear cuenta nueva
- [ ] **Login**: admin@academianova.com
- [ ] **Navegación**: Todas las páginas cargan
- [ ] **Responsive**: Funciona en móvil
- [ ] **Cursos**: Lista de cursos visible
- [ ] **Carreras**: Información de carreras

---

## 🚨 Troubleshooting

### Error: "Failed to fetch"
```bash
# Verificar variables de entorno
console.log(import.meta.env.VITE_SUPABASE_URL)
```

### Error: "Table doesn't exist"
```sql
-- Re-ejecutar setup SQL
-- Verificar en Supabase → Table Editor
```

### Build Error
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 en rutas
- ✅ Verificar que netlify.toml existe
- ✅ Contenido: redirects de SPA configurados

---

## 📊 Métricas de Success

Una vez deployed, tu app debería tener:
- ⚡ **Lighthouse Score**: 90+ Performance
- 🔐 **Security**: A+ (SSL, headers seguros)
- 📱 **Mobile**: Totalmente responsive
- 🚀 **Load Time**: < 3 segundos
- ✅ **Uptime**: 99.9% (Netlify + Supabase)

---

## 🎯 Next Steps

Después del deploy inicial:

1. **Configurar dominio custom** (opcional)
2. **Configurar Edge Functions** para emails automáticos
3. **Analytics**: Google Analytics o Plausible
4. **Monitoring**: Sentry para error tracking
5. **SEO**: Meta tags, sitemap.xml

---

🎉 **¡Felicidades! Tu aplicación está en producción y lista para impresionar.**

**URL ejemplo**: https://academianova-demo.netlify.app
**Tiempo total**: ~15 minutos
**Costo**: $0 (Free tiers de Supabase + Netlify)