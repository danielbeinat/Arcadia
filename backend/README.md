# AcademiaNova Backend

Backend API para la plataforma universitaria AcademiaNova.

## 🚀 Características

- **Autenticación JWT** con bcrypt para hashing de contraseñas
- **API RESTful** para usuarios, cursos y carreras
- **Validación de datos** con Zod
- **Manejo de errores** centralizado
- **Rate limiting** para protección contra abusos
- **CORS** configurado para el frontend
- **TypeScript** para type safety

## 🛠️ Tecnologías

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Validación**: Zod
- **Autenticación**: JWT + bcrypt
- **Base de datos**: En memoria (temporal, para producción usar Prisma + PostgreSQL)

## ⚙️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Copiar variables de entorno:
```bash
cp .env.example .env
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

4. Construir para producción:
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/password` - Cambiar contraseña
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario (admin)

### Carreras
- `GET /api/degrees` - Listar carreras
- `GET /api/degrees/:id` - Obtener carrera
- `POST /api/degrees` - Crear carrera (admin)
- `PUT /api/degrees/:id` - Actualizar carrera (admin)
- `DELETE /api/degrees/:id` - Eliminar carrera (admin)

### Cursos
- `GET /api/courses` - Listar cursos
- `GET /api/courses/:id` - Obtener curso
- `POST /api/courses` - Crear curso (admin)
- `PUT /api/courses/:id` - Actualizar curso (admin)
- `DELETE /api/courses/:id` - Eliminar curso (admin)
- `POST /api/courses/:id/enroll` - Inscribirse (estudiante)
- `DELETE /api/courses/:id/enroll` - Abandonar curso (estudiante)

## 🔐 Variables de Entorno

JWT_SECRET=
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=

## 🚀 Despliegue en Render

1. Crear cuenta en [Render](https://render.com)
2. Conectar repositorio GitHub
3. Configurar variables de entorno en Render
4. Deploy automático en cada push


