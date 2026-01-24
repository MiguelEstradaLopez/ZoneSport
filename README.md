# 🏆 ZoneSport - Antioquia

**ZoneSport** es una plataforma integral para la gestión de torneos, rankings y eventos deportivos, diseñada con una estética moderna y minimalista. Permite a usuarios crear eventos deportivos, gestionar partidos y ver clasificaciones en tiempo real.

---

## 🎯 Características Principales

✅ **Autenticación JWT** - Registro, login y recuperación de contraseña  
✅ **Gestión de Eventos** - Crear y administrar torneos deportivos  
✅ **Sistema de Partidos** - Registrar resultados de encuentros  
✅ **Clasificaciones Dinámicas** - Tablas de posiciones actualizadas automáticamente  
✅ **Noticias y Blog** - Publicar contenido deportivo  
✅ **Búsqueda de Usuarios** - Conectar con otros deportistas  
✅ **Recuperación de Contraseña** - Por email con tokens seguros  

---

## 🚀 Tech Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 16+ React 19 Tailwind CSS TypeScript |
| **Backend** | NestJS 11 TypeORM PostgreSQL |
| **Base Datos** | PostgreSQL 16 (Docker) |
| **Autenticación** | JWT + Bcrypt |
| **Email** | Nodemailer (SMTP) |

---

## 🛠️ Instalación Rápida

### Requisitos

- Node.js v18+
- Docker & Docker Compose
- Git

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/MiguelEstradaLopez/ZoneSport.git
cd ZoneSport

# 2. Iniciar base de datos
docker-compose up -d

# 3. Configurar Backend
cd server
cp .env.example .env
npm install
npm run start:dev

# 4. Configurar Frontend (nueva terminal)
cd client
npm install
npm run dev
```

### URLs de Acceso

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>

---

## 📚 Documentación

- **[GUIA_DESARROLLO.md](GUIA_DESARROLLO.md)** - Guía completa de desarrollo y arquitectura
- **[VARIABLES_ENTORNO.md](VARIABLES_ENTORNO.md)** - Configuración de variables de entorno

---

## 🏗️ Estructura del Proyecto

```
ZoneSport/
├── server/                 # Backend NestJS
│   ├── src/
│   │   ├── auth/          # Autenticación JWT
│   │   ├── users/         # Gestión de usuarios
│   │   ├── events/        # Gestión de eventos
│   │   ├── matches/       # Gestión de partidos
│   │   ├── sports/        # Catálogo de deportes
│   │   ├── news/          # Blog y noticias
│   │   ├── email/         # Servicio de email
│   │   └── app.module.ts
│   ├── .env               # Variables locales (NO commitar)
│   ├── .env.example       # Template de variables (SÍ commitar)
│   └── package.json
├── client/                 # Frontend Next.js
│   ├── app/
│   │   ├── page.tsx       # Home
│   │   ├── login/
│   │   ├── registrar/
│   │   ├── eventos/
│   │   ├── noticias/
│   │   ├── clasificacion/
│   │   ├── perfil/
│   │   ├── olvide-contrasena/
│   │   └── reset-password/
│   ├── components/
│   ├── services/
│   └── package.json
└── docker-compose.yml     # Configuración PostgreSQL
```

---

## 🔐 Seguridad

- ✅ Credenciales protegidas con `.env`
- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Tokens JWT con expiración
- ✅ CORS configurado dinámicamente
- ✅ Validación de entrada en frontend y backend
- ✅ Recuperación de contraseña por email segura

---

## 👨‍💻 Desarrolladores

Para comenzar a desarrollar, consulta [GUIA_DESARROLLO.md](GUIA_DESARROLLO.md).

---

## 📞 Soporte

Para problemas o preguntas, revisar la documentación completa o crear un issue en GitHub.

---

**Última actualización**: 23 de enero de 2026  
**Estado**: ✅ En desarrollo activo  
**Licencia**: MIT

### 4. Instalar dependencias del Frontend

```bash
cd client
npm install
```

---

## 🏃 Ejecución Local

### Backend (NestJS)

```bash
cd server
npm run start:dev
```

El servidor estará disponible en `http://localhost:3001`

### Frontend (Next.js)

```bash
cd client
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 📋 Principales Módulos

### Backend (NestJS)

#### 1. **Users** - Gestión de usuarios/atletas

- `POST /users` - Registrar nuevo usuario
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario específico
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

#### 2. **Sports** - Catálogo de deportes

- `POST /sports` - Crear deporte
- `GET /sports` - Listar deportes
- `GET /sports/:id` - Obtener deporte
- `PATCH /sports/:id` - Actualizar deporte
- `DELETE /sports/:id` - Eliminar deporte

#### 3. **Events** - Gestión de torneos y eventos

- `POST /events` - Crear evento
- `GET /events` - Listar eventos
- `GET /events/:id` - Obtener evento con detalles
- `GET /events/:id/classification` - Obtener tabla de clasificación
- `PATCH /events/:id` - Actualizar evento
- `DELETE /events/:id` - Eliminar evento

#### 4. **Matches** - Gestión de partidos

- `POST /matches` - Crear partido
- `GET /matches` - Listar partidos
- `GET /matches/:id` - Obtener partido
- `GET /matches/event/:eventId` - Obtener partidos de un evento
- `POST /matches/:id/result` - Registrar resultado
- `PATCH /matches/:id` - Actualizar partido
- `DELETE /matches/:id` - Eliminar partido

#### 5. **Classifications** - Tablas de clasificación dinámicas

- `GET /classifications/event/:eventId` - Obtener tabla del evento
- `POST /classifications/event/:eventId/team` - Agregar equipo a la tabla
- `DELETE /classifications/:id` - Eliminar equipo de la tabla

### Frontend (Next.js)

#### Páginas Principales

- `/` - Página de inicio
- `/eventos` - Listado de eventos
- `/eventos/[id]` - Detalles de evento, partidos y clasificación
- `/clasificacion` - Tablas de clasificación por evento
- `/noticias` - Noticias deportivas
- `/perfil` - Perfil del usuario
- `/registrar` - Registro de nuevos usuarios

#### Componentes

- **Navbar** - Navegación principal con enlaces a todas las secciones
- Servicios HTTP para consumo de API

---

## 🔒 Seguridad

### Variables de Entorno (Backend)

Archivo `.env` en `/server` (ya configurado):

```
NODE_ENV=development
DATABASE_URL=postgresql://miki_user:7667@localhost:5432/zonesport_db
JWT_SECRET=miki_secreto_2026_antioquia
```

### Variables de Entorno (Frontend)

Archivo `.env.local` en `/client` (ya configurado):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

### Características de Seguridad Implementadas

- ✅ Hashing de contraseñas con bcrypt
- ✅ CORS habilitado para comunicación frontend-backend
- ✅ Validación de datos con class-validator (DTOs)
- ✅ TypeORM para protección contra SQL injection

---

## 📊 Estructura de Base de Datos

### Tablas Principales

1. **users** - Atletas, organizadores, administradores
2. **sports** - Catálogo de deportes (fútbol, tenis, etc.)
3. **events** - Torneos y eventos
4. **matches** - Partidos con resultados
5. **classifications** - Tablas de clasificación dinámicas

### Relaciones

- User → Event (organizador)
- Sport → Event
- Event → Matches
- Event → Classifications

---

## 🎨 Guía de Estilos

### Colores Corporativos

- **Azul Profundo (#007ACC)**: Acciones, enlaces, elementos principales
- **Verde Lima (#8BC34A)**: Éxito, victoria, ranking

### Tipografía

- **Poppins**: Fuente principal (encabezados, UI)
- **JetBrains Mono**: Datos tabulares, resultados

### Tema

- Dark mode por defecto
- Interfaz minimalista y moderna
- Responsive en todos los dispositivos

---

## 🧪 Testing

### Backend

```bash
# Tests unitarios
cd server
npm run test

# Tests end-to-end
npm run test:e2e

# Cobertura
npm run test:cov
```

### Frontend

```bash
# ESLint
cd client
npm run lint
```

---

## 📈 Despliegue

### Opciones de Hosting Gratuito

- **Frontend**: [Vercel](https://vercel.com/) - Optimizado para Next.js
- **Backend**: [Render](https://render.com/) - Servicio web gratuito
- **Base de Datos**: [Render Postgres](https://render.com/) - PostgreSQL gratuito

---

## 📝 Documentación Adicional

El documento completo de especificaciones se encuentra en `ZoneSport.pdf`

---

## 👥 Contribución

Este es un proyecto educativo. Para sugerencias o mejoras, contacta al equipo de desarrollo.

---

## 📄 Licencia

Este proyecto está bajo licencia UNLICENSED (Privada). Derechos reservados © 2026 ZoneSport Antioquia.

---

## 🤝 Soporte

Para reportar bugs o sugerir mejoras, abre un issue en el repositorio de GitHub.

---

**Construido con ❤️ para la comunidad deportiva de Antioquia** 🏀⚽🎾
