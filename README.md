# AcademiaNova - Plataforma Universitaria Digital

AcademiaNova es una moderna plataforma de gestión universitaria desarrollada con React y Vite. Ofrece una experiencia integral para estudiantes y profesores, permitiendo la gestión de cursos, visualización de programas académicos y un sistema de autenticación robusto con control de acceso basado en roles.

## 🚀 Características Principales

- **Sistema de Autenticación Local**: Registro e inicio de sesión persistente utilizando `localStorage`.
- **Control de Acceso (RBAC)**: Rutas protegidas para diferentes perfiles (Estudiante, Profesor, Administrador).
- **Catálogo de Carreras**: Visualización detallada de programas presenciales y virtuales.
- **Portal del Estudiante**: Dashboard personalizado con información académica y servicios.
- **Modo Offline**: Soporte básico para funcionamiento sin conexión y sincronización.
- **Diseño Responsivo**: Interfaz moderna construida con Tailwind CSS y animaciones fluidas.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite.
- **Estilos**: Tailwind CSS, Framer Motion (animaciones).
- **Enrutamiento**: React Router Dom v6.
- **Iconos**: React Icons (Fi, Lu).
- **Estado**: React Context API para autenticación y notificaciones.

## 📁 Estructura del Proyecto

```text
src/
├── Components/     # Componentes reutilizables (Auth, Header, Footer, etc.)
├── hooks/          # Hooks personalizados (useAuth, useEvents, etc.)
├── pages/          # Vistas principales (Home, Portal, Dashboard, Login)
├── types/          # Definiciones de interfaces TypeScript
├── utils/          # Utilidades (Gestión offline, validaciones)
└── assets/         # Recursos estáticos (Imágenes, datos de carreras)
```

## ⚙️ Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Construir para producción**:
   ```bash
   npm run build
   ```

## 🔑 Credenciales de Prueba

El sistema incluye usuarios predefinidos para facilitar las pruebas:

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@universidad.com` | `admin` |
| **Profesor** | `prof@universidad.com` | `prof` |

*También puedes registrar nuevos usuarios directamente desde la página de Registro.*

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
