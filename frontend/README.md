# AcademiaNova Frontend

Frontend de la plataforma universitaria AcademiaNova, construido con React, TypeScript y Vite.

## 🚀 Tecnologías

- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **HTTP Client**: Fetch API con servicio personalizado

## 🛠️ Instalación

```bash
npm install
```

## 📡 Variables de Entorno

Copia `.env.example` a `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Desarrollo

```bash
npm run dev
```

## 🏗️ Build para Producción

```bash
npm run build
```

## 📋 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes UI básicos
│   │   ├── layout/         # Layout components
│   │   └── forms/          # Form components
│   ├── pages/              # Páginas principales
│   │   ├── auth/           # Autenticación
│   │   ├── dashboard/      # Dashboard
│   │   ├── courses/        # Gestión de cursos
│   │   ├── degrees/        # Carreras
│   │   └── profile/        # Perfil de usuario
│   ├── hooks/              # Custom hooks
│   ├── services/           # Servicios de API
│   ├── types/              # Tipos TypeScript
│   ├── utils/              # Utilidades
│   ├── context/            # React Context
│   └── styles/             # Estilos globales
├── public/                 # Archivos estáticos
└── dist/                   # Build de producción
```

## 🔗 Conexión con Backend

El frontend se conecta al backend a través del servicio `api.ts`:

```typescript
import { apiClient } from '@/services/api';

// Ejemplo de uso
const user = await apiClient.getProfile();
const courses = await apiClient.getCourses();
```

## 🎨 Características

- ✅ **Diseño Responsive**: Mobile-first design
- ✅ **Dark Mode**: Soporte para tema oscuro
- ✅ **Accesibilidad**: WCAG 2.1 AA compliance
- ✅ **Performance**: Optimizado con React.memo y lazy loading
- ✅ **Type Safety**: TypeScript estricto
- ✅ **SEO**: Meta tags optimizados
- ✅ **PWA**: Service Worker para offline

## 🚀 Despliegue

### Netlify (Recomendado)

1. Conecta el repositorio a Netlify
2. Configura las variables de entorno
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

1. Conecta el repositorio a Vercel
2. Configura las variables de entorno
3. Build command: `npm run build`
4. Output directory: `dist`

## 🔐 Autenticación

El frontend maneja la autenticación a través de:

- **Tokens JWT**: Almacenados en localStorage
- **Context API**: Para estado global de autenticación
- **Protected Routes**: Rutas protegidas por rol
- **Auto-refresh**: Renovación automática de tokens

## 📱 PWA Features

- **Offline Support**: Cache estratégico
- **Install Prompt**: Instalación como app nativa
- **Push Notifications**: Notificaciones push (opcional)

## 🧪 Testing

```bash
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run lint        # ESLint
npm run type-check  # TypeScript check
```

## 📊 Performance

- **Lighthouse Score**: 95+ en todas las métricas
- **Bundle Size**: < 1MB gzipped
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2s
