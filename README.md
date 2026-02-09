# AcademiaNova - Plataforma Universitaria Digital 🎓

AcademiaNova es una plataforma integral de gestión universitaria de nivel profesional, diseñada con una arquitectura Full Stack moderna. Ofrece una solución completa para la administración académica, permitiendo la gestión de usuarios, cursos, programas de estudio y comunicaciones automáticas, todo bajo un entorno seguro y escalable.

---

## 🚀 Características Principales

| Área | Descripción |
|------|-------------|
| **RBAC** | Control de acceso basado en roles: Admin, Profesor, Estudiante |
| **Panel Admin** | Aprobación/rechazo de solicitudes, vista de documentos (DNI, analítico) |
| **Autenticación** | JWT, Supabase Auth, validación con Zod |
| **Documentos** | Subida de DNI y analítico, visualización en modal con URLs firmadas |
| **Realtime** | Notificaciones en tiempo real, presencia de usuarios, actualizaciones live |
| **Edge Functions** | Funciones serverless para aprobaciones automáticas y emails |
| **Búsqueda Avanzada** | Full-text search con PostgreSQL, filtros inteligentes y sugerencias |
| **Performance Analytics** | Monitoreo de Web Vitals, métricas de usuario y rendimiento |
| **PWA** | Soporte offline, service worker, notificaciones |
| **UX** | Animaciones Framer Motion, diseño responsive, lazy loading |

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** | **Framer Motion** | **Lucide React**
- **Supabase** (Auth + DB + Storage)
- **Zod** (validación de formularios)
- **Vitest** (tests unitarios)

### Backend / Infraestructura
- **Supabase**: PostgreSQL, Auth, Storage, Edge Functions
- **Netlify** (frontend deployment)
- **Real-time**: WebSockets con Supabase Realtime

---

## 📁 Estructura del Proyecto

```
university-site/
├── frontend/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── Components/         # Componentes reutilizables
│   │   │   ├── Auth/          # Autenticación
│   │   │   ├── Dashboard/     # Paneles de control
│   │   │   ├── Notifications/ # Sistema de notificaciones
│   │   │   └── ...
│   │   ├── hooks/             # Custom hooks avanzados
│   │   │   ├── useAuth.tsx    # Autenticación
│   │   │   ├── useRealtime.ts # Notificaciones real-time
│   │   │   ├── useAdvancedSearch.ts # Búsqueda inteligente
│   │   │   └── usePerformanceMonitoring.ts
│   │   ├── services/          # Supabase services
│   │   ├── lib/              # Validación (Zod), Supabase client
│   │   └── types/            # Tipos TypeScript
├── supabase/                   # Edge Functions
│   └── functions/             # Serverless functions
│       ├── approve-student/   # Aprobación automática
│       └── send-approval-email/ # Emails automatizados
└── README.md
```

---

## ⚙️ Instalación

### 1. Clonar y preparar

```bash
git clone https://github.com/danielbeinat/Arcadia.git
cd Arcadia/frontend
npm install
```

### 2. Variables de entorno (frontend)

Crear `frontend/.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publico
```

📋 **Ver guía completa**: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

### 3. Configuración de Supabase

1. **Crear proyecto** en [supabase.com](https://supabase.com)
2. **Setup base de datos**:
   ```sql
   -- 1. Ejecutar en SQL Editor de Supabase
   -- SQL disponible en documentación completa
   ```
3. **Configurar Storage** para documentos (DNI, analítico)
4. **Edge Functions** (opcional):
   ```bash
   supabase login
   supabase link --project-ref tu-project-ref
   supabase functions deploy approve-student
   supabase functions deploy send-approval-email
   ```

📋 **Guía completa de setup**: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

### 4. Ejecutar

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Tests
npm run test
```

---

## 👤 Usuario Admin

- **Email:** `admin@arcadia.edu`
- **Contraseña:** según seed/configuración inicial

---

## 🌐 Rutas Principales

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Inicio | Público |
| `/login` | Iniciar sesión | Público |
| `/inscripciones` | Formulario inscripción | Público |
| `/portal` | Portal estudiante | Autenticado |
| `/dashboard` | Panel (admin/profesor/estudiante) | Autenticado |
| `/eventos` | Calendario eventos | Público |

---

## 🧪 Tests

```bash
npm run test          # Ejecutar una vez
npm run test:watch    # Modo watch
```

---

## 📦 Build y Despliegue

- **Frontend:** Netlify (React + Vite)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Real-time:** Supabase Realtime (WebSockets)
- **Files:** Supabase Storage (documentos, imágenes)

### 🚀 Deploy Steps
1. **Supabase**: Crear proyecto y ejecutar SQL setup
2. **Netlify**: Conectar repo, configurar env vars
3. **Testing**: Verificar funcionalidades en producción

📋 **Guía completa**: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

## 🚀 Funcionalidades Avanzadas Implementadas

### 🔔 Notificaciones en Tiempo Real
- **WebSockets** con Supabase Realtime
- Notificaciones instantáneas de cambios de estado
- Sistema de presencia de usuarios online
- **Tecnología**: Supabase Realtime, WebSockets, React hooks custom

```typescript
// Hook personalizado para notificaciones en tiempo real
const { isConnected } = useRealtime({
  enableUserUpdates: true,
  enableCourseUpdates: true,
  enableGlobalNotifications: true,
});
```

### 🔍 Búsqueda Avanzada con IA
- **Full-Text Search** con PostgreSQL
- Búsqueda multilingüe (español optimizado)
- Filtros inteligentes y sugerencias automáticas
- **Tecnología**: PostgreSQL FTS, tsvector, GIN indexes

```sql
-- Ejemplo de búsqueda avanzada implementada
SELECT * FROM courses 
WHERE ts_vector @@ to_tsquery('spanish', 'programación & javascript')
ORDER BY ts_rank(ts_vector, to_tsquery('spanish', 'programación & javascript')) DESC;
```

### ⚡ Edge Functions Serverless
- **Funciones serverless** en Deno runtime
- Procesamiento automático de aprobaciones
- Sistema de emails con plantillas HTML
- **Tecnología**: Supabase Edge Functions, Deno, TypeScript

```typescript
// Edge Function para aprobación automática
export async function approveStudent(studentId: string, action: 'APROBADO' | 'RECHAZADO') {
  // Lógica serverless para procesar solicitudes
  // Actualizar BD + Enviar email + Crear notificación
}
```

### 📊 Performance Analytics
- **Web Vitals** en tiempo real (LCP, FID, CLS, FCP, TTFB)
- Monitoreo de rendimiento de usuario
- Métricas de búsquedas y acciones
- **Tecnología**: Web Vitals API, Performance Observer, custom hooks

```typescript
// Sistema de métricas en tiempo real
const { vitals, trackUserAction, trackSearch } = usePerformanceMonitoring();
// Automáticamente rastrea: LCP, FID, CLS, errores, búsquedas
```

### 🛡️ Seguridad Avanzada
- **Row Level Security** (RLS) en PostgreSQL
- Políticas granulares de acceso a datos
- Auditoría completa de acciones administrativas
- **Tecnología**: PostgreSQL RLS, JWT, Supabase Auth

### 🎯 Arquitectura Escalable
- **Custom Hooks** para reutilización de lógica
- **TypeScript** estricto para type safety
- **Error Boundary** y manejo de errores robusto
- **Optimización** con lazy loading y code splitting

## 📈 Métricas del Proyecto

- **Lines of Code**: ~12,000+ líneas (limpieza de duplicados)
- **Custom Hooks**: 8 hooks avanzados
- **Components**: 25+ componentes reutilizables
- **Edge Functions**: 2 funciones serverless
- **Database Tables**: 8+ tablas con RLS
- **Real-time Channels**: 4 canales de WebSocket
- **Performance Metrics**: 15+ métricas tracked
- **Architecture**: 100% Serverless (Supabase + Netlify)

## 🌟 Arquitectura Serverless

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Netlify       │    │    Supabase      │    │  Edge Functions │
│   (Frontend)    │◄──►│  (Backend+DB)    │◄──►│  (Serverless)   │
│                 │    │                  │    │                 │
│ • React App     │    │ • PostgreSQL     │    │ • Approvals     │
│ • Static Files  │    │ • Auth           │    │ • Email Send    │
│ • CDN Global    │    │ • Storage        │    │ • Deno Runtime  │
└─────────────────┘    │ • Realtime       │    └─────────────────┘
                       │ • Row Level Sec  │
                       └──────────────────┘
```

---

Desarrollado por [Daniel Beinat](https://github.com/danielbeinat) - 2026
