# 🔧 Troubleshooting Guide - AcademiaNova

## ❗ Error 401 - Failed to load resource

### Síntomas
```
Failed to load resource: the server responded with a status of 401 ()
TypeError: g.realtime.onOpen is not a function
Failed to save session: Object
```

### Causa
El error 401 indica problemas de autenticación/autorización con Supabase. Esto ocurre cuando:
1. Las políticas RLS (Row Level Security) no están configuradas correctamente
2. La tabla `user_sessions` o `performance_metrics` no existen
3. Las variables de entorno están mal configuradas

### ✅ Solución Paso a Paso

#### 1. Verificar Variables de Entorno
```bash
# En tu archivo .env (frontend/)
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**Cómo obtener las credenciales:**
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Settings → API
3. Copia "Project URL" y "anon public key"

#### 2. Configurar Base de Datos
Ejecuta este SQL en tu Supabase SQL Editor:

```sql
-- Ejecutar PRODUCTION_SQL_SETUP.sql completo
-- O copiar/pegar el contenido desde el archivo
```

#### 3. Verificar Políticas RLS
En Supabase Dashboard → Authentication → Policies:

✅ Debe aparecer:
- "Public can read degrees"
- "Public can read courses" 
- "Anyone can create user account"
- "Users can view their own profile"

#### 4. Verificar Tablas
En Supabase → Table Editor debe aparecer:
- ✅ users
- ✅ courses
- ✅ degrees
- ✅ enrollments

#### 5. Storage Configuration
1. Ve a Storage en Supabase
2. Crear bucket: `documents`
3. Políticas → Add policy:
   ```sql
   -- Permitir uploads públicos (temporal para desarrollo)
   CREATE POLICY "Public can upload documents" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'documents');
   
   CREATE POLICY "Public can view documents" ON storage.objects
   FOR SELECT USING (bucket_id = 'documents');
   ```

---

## 🚨 Otros Errores Comunes

### Error: "Table doesn't exist"
```bash
# Síntoma
relation "public.users" does not exist
```

**Solución:**
1. Ejecutar `PRODUCTION_SQL_SETUP.sql` completo
2. Verificar en Table Editor que las tablas aparezcan
3. Si persiste, borrar proyecto y crear uno nuevo

### Error: "Email already registered"
```bash
# Síntoma
User already registered
```

**Solución:**
1. Usar email diferente
2. O ir a Authentication → Users y eliminar el usuario duplicado

### Error: Build fails en Netlify
```bash
# Síntoma
Build failed: Module not found
```

**Solución:**
```bash
# Verificar build local
cd frontend
npm install
npm run build

# Si funciona local, verificar en Netlify:
# Build settings:
# - Base directory: frontend
# - Build command: npm install && npm run build  
# - Publish directory: frontend/dist
```

### Error: "Failed to fetch"
**Causa:** Variables de entorno mal configuradas en Netlify

**Solución:**
1. Netlify → Site settings → Environment variables
2. Agregar:
   ```
   VITE_SUPABASE_URL = https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY = tu-anon-key
   ```
3. Redesplegar: Deploys → Trigger deploy

### Error: 404 en rutas (ej: /dashboard)
**Causa:** Netlify no está configurado para SPAs

**Solución:**
Verificar que existe `netlify.toml` en la raíz:
```toml
[build]
  base = "frontend"
  command = "npm install && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🧪 Testing en Producción

### Checklist Básico
- [ ] ✅ Homepage carga (`/`)
- [ ] ✅ Login funciona (`/login`)
- [ ] ✅ Registro funciona (`/inscripciones`)
- [ ] ✅ Dashboard accesible después del login
- [ ] ✅ Upload de archivos funciona
- [ ] ✅ Navegación responsive (móvil)

### URLs de Prueba
```
https://tu-app.netlify.app/
https://tu-app.netlify.app/login
https://tu-app.netlify.app/inscripciones
https://tu-app.netlify.app/dashboard
https://tu-app.netlify.app/courses
```

### Usuarios de Prueba
```
Admin: admin@academianova.com
(Crear manualmente en Supabase Auth si es necesario)
```

---

## 🔍 Debugging Avanzado

### 1. Console Browser (F12)
```javascript
// Verificar variables de entorno
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);

// Verificar conexión a Supabase
import { supabase } from './lib/supabase';
supabase.auth.getSession().then(console.log);
```

### 2. Network Tab
- ✅ Requests a `supabase.co` deben ser 200
- ❌ Si aparecen 401/403, revisar políticas RLS
- ❌ Si aparecen CORS, revisar URL de Supabase

### 3. Supabase Logs
Dashboard → Logs:
- Auth logs: Ver intentos de login/registro
- API logs: Ver requests fallidas
- Realtime logs: Ver problemas de WebSocket

### 4. Netlify Logs
Site → Deploys → Ver logs del build:
- Build logs: Errores de compilación
- Function logs: Si usas Netlify Functions

---

## 📞 Cuando Todo Falla

### Opción 1: Reset Completo
```bash
# 1. Crear nuevo proyecto Supabase
# 2. Ejecutar PRODUCTION_SQL_SETUP.sql
# 3. Actualizar variables de entorno
# 4. Redesplegar en Netlify
```

### Opción 2: Debugging Local
```bash
cd frontend
npm install
npm run dev

# Probar local antes de deployment
# Verificar que funcione en http://localhost:5173
```

### Opción 3: Versión Simplificada
```bash
# Comentar temporalmente funcionalidades avanzadas:
# - useRealtime hook
# - usePerformanceMonitoring
# - Subida de archivos

# Mantener solo:
# - Login/Register básico
# - Navegación simple
# - Datos estáticos
```

---

## 📋 Contacto y Recursos

### Documentación Oficial
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [React Router](https://reactrouter.com)

### Comunidades
- [Supabase Discord](https://discord.supabase.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### En Caso de Emergencia
Si nada funciona, puedes:
1. Usar la versión de desarrollo local
2. Crear demo con datos mock (sin BD)
3. Contactar soporte de Supabase si es issue de plataforma

---

**🎯 Recuerda: El 90% de errores 401 se solucionan con el setup SQL correcto y las variables de entorno bien configuradas.**