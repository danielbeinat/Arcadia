# AcademiaNova - Plataforma Universitaria Digital 🎓

AcademiaNova es una plataforma integral de gestión universitaria de nivel profesional, diseñada con una arquitectura Full Stack moderna. Ofrece una solución completa para la administración académica, permitiendo la gestión de usuarios, cursos, programas de estudio y comunicaciones automáticas, todo bajo un entorno seguro y escalable.

## 🚀 Características Principales

- **Gestión de Usuarios (RBAC)**: Sistema de Control de Acceso Basado en Roles para Administradores, Profesores y Estudiantes.
- **Panel de Administración**: Dashboard avanzado para la aprobación/rechazo de solicitudes de ingreso y gestión de la comunidad educativa.
- **Autenticación Robusta**: Implementación segura mediante JWT (JSON Web Tokens) y encriptación de contraseñas con Bcrypt.
- **Comunicaciones Automáticas**: Sistema integrado de envío de emails (Nodemailer) para validación de cuentas y notificaciones de estado académico.
- **Gestión de Medios**: Integración con Cloudinary para el manejo eficiente de imágenes y activos en la nube.
- **Experiencia de Usuario (UX)**: Interfaz fluida con animaciones de alto nivel, diseño 100% responsive y soporte PWA (Progressive Web App).
- **Arquitectura Limpia**: Separación clara de responsabilidades en el backend (Controladores, Servicios, Middlewares) y componentes modulares en el frontend.

## 🛠️ Tecnologías Utilizadas

### **Frontend**

- **React 18** & **Vite**: Biblioteca principal y herramienta de construcción de alto rendimiento.
- **TypeScript**: Tipado estático para un desarrollo seguro y mantenible.
- **Tailwind CSS**: Estilizado moderno y eficiente.
- **Framer Motion**: Animaciones y transiciones avanzadas.
- **Lucide React**: Iconografía moderna.

### **Backend**

- **Node.js** & **Express**: Entorno de ejecución y framework para la API RESTful.
- **Prisma ORM**: Gestión de base de datos con tipado seguro.
- **PostgreSQL (Supabase)**: Base de datos relacional escalable.
- **JWT & Bcrypt**: Seguridad y autenticación.
- **Nodemailer**: Motor de notificaciones por correo electrónico.
- **Cloudinary**: Almacenamiento de imágenes en la nube.

## 📁 Estructura del Proyecto

El proyecto está organizado en una estructura monorepo simplificada:

- `/frontend`: Aplicación cliente desarrollada con React.
- `/backend`: Servidor API REST y lógica de negocio.

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/danielbeinat/Arcadia.git
```

### 2. Configurar el Backend

```bash
cd backend
npm install
# Crear archivo .env basado en la configuración necesaria (DB, JWT, Cloudinary, Email)
npx prisma generate
npm run dev
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Despliegue

- **Backend**: Desplegado en **Render**.
- **Frontend**: Desplegado en **Netlify**.
- **Base de Datos**: Hosteada en **Supabase**.

---

Desarrollado por [Daniel Beinat](https://github.com/danielbeinat) - 2026
