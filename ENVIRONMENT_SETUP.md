# 🔧 Environment Setup Guide - AcademiaNova

Esta guía te ayudará a configurar las variables de entorno necesarias para desplegar AcademiaNova en producción.

## 📁 Archivos de Configuración Requeridos

### 1. Frontend (.env)
Crear archivo `frontend/.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publico

# Optional: Para debugging en desarrollo
VITE_ENV=production
```

## 🚀 Configuración de Supabase

### 1. Crear Proyecto Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Click "New Project"
3. Selecciona organización
4. Nombre del proyecto: `academianova-production`
5. Genera contraseña segura para la DB
6. Selecciona región (recomendado: South America)

### 2. Obtener Credenciales
En tu dashboard de Supabase:

1. **Project URL**: 
   - Ve a Settings → API
   - Copia "Project URL"

2. **Anon Key**:
   - Ve a Settings → API  
   - Copia "anon/public key"

### 3. Configurar Base de Datos
Ejecuta los siguientes SQL en orden en el SQL Editor de Supabase:

```sql
-- 1. Setup básico
-- Pega el contenido de: setup-supabase.sql

-- 2. Funcionalidades avanzadas  
-- Pega el contenido de: create-tables.sql

-- 3. Agregar columnas de documentos
-- Pega el contenido de: add-document-columns.sql
```

### 4. Configurar Storage
1. Ve a Storage en Supabase Dashboard
2. Crea bucket: `documents`
3. Configurar políticas:
   - Enable "Public" si quieres URLs públicas
   - O configura RLS para acceso controlado

### 5. Configurar Edge Functions (Opcional)
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Conectar proyecto
supabase link --project-ref tu-project-ref

# Desplegar funciones
supabase functions deploy approve-student
supabase functions deploy send-approval-email
```

## 📱 Deployment en Netlify

### 1. Preparar Repositorio
```bash
# Asegurar que el build funcione localmente
cd frontend
npm install
npm run build
```

### 2. Configurar Netlify
1. Conecta tu repo de GitHub a Netlify
2. **Build settings**:
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `frontend/dist`

3. **Environment Variables** en Netlify:
   ```
   VITE_SUPABASE_URL = https://tu-proyecto-id.supabase.co
   VITE_SUPABASE_ANON_KEY = tu-anon-key-publico
   ```

### 3. Configurar Redirects
El archivo `netlify.toml` ya está configurado para SPAs de React.

## ✅ Checklist Pre-Deploy

- [ ] Supabase proyecto creado
- [ ] Base de datos configurada (SQL ejecutado)
- [ ] Storage bucket creado
- [ ] Variables de entorno configuradas
- [ ] Build local exitoso (`npm run build`)
- [ ] Repositorio en GitHub actualizado
- [ ] Netlify conectado al repo

## 🧪 Testing en Producción

### 1. Funcionalidades a Probar
- [ ] **Login/Register**: Autenticación funciona
- [ ] **RBAC**: Admin puede aprobar estudiantes
- [ ] **Upload**: Subida de documentos (DNI, analítico)
- [ ] **Real-time**: Notificaciones instantáneas
- [ ] **Search**: Búsqueda avanzada de cursos
- [ ] **Performance**: Web Vitals en Network tab

### 2. URLs de Prueba
```
https://tu-dominio.netlify.app/
https://tu-dominio.netlify.app/login
https://tu-dominio.netlify.app/dashboard
https://tu-dominio.netlify.app/inscripciones
```

### 3. Usuario de Prueba Admin
Crear manualmente en Supabase:
```sql
INSERT INTO users (email, name, lastName, role, program, password, status) VALUES
('admin@academianova.com', 'Admin', 'Sistema', 'ADMIN', 'Administración', 'hashed-password', 'APROBADO');
```

## 🔍 Debugging Común

### Error: "Failed to fetch"
- ✅ Verificar VITE_SUPABASE_URL
- ✅ Verificar que Supabase esté activo
- ✅ Revisar CORS en Supabase (usualmente automático)

### Error: "Invalid API key"
- ✅ Verificar VITE_SUPABASE_ANON_KEY
- ✅ Regenerar key si es necesario

### Error: "Table doesn't exist"  
- ✅ Ejecutar setup-supabase.sql
- ✅ Verificar que las migraciones corrieron

### Build Errors
- ✅ `npm install` en frontend
- ✅ Verificar que todas las deps estén en package.json
- ✅ TypeScript errors resueltos

## 📊 Monitoring

### Performance
- Usar Chrome DevTools → Network
- Verificar Core Web Vitals
- Monitoring automático con `usePerformanceMonitoring` hook

### Errors
- Console del navegador
- Supabase Dashboard → Logs
- Netlify Deploy logs

---

🎯 **¡Tu proyecto está listo para impresionar a los recruiters!**