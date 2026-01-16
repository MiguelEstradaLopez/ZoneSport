# 🏆 ZoneSport - Antioquia

**ZoneSport** es una plataforma integral para la gestión de torneos, rankings y eventos deportivos, diseñada con una estética moderna y minimalista.

---

## 🚀 Tecnologías Principales

Este proyecto utiliza una arquitectura de monorepo dividida en:

* **Frontend**: [Next.js 15+](https://nextjs.org/) con TypeScript y Tailwind CSS.
* **Backend**: [NestJS](https://nestjs.com/) con TypeORM.
* **Base de Datos**: PostgreSQL corriendo sobre **Docker**.
* **Estilos**: Identidad visual basada en `Azul Profundo (#007ACC)` y `Verde Lima (#8BC34A)`.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (v18 o superior)
* [Docker](https://www.docker.com/) y Docker Compose
* [Git](https://git-scm.com/)

---

## 📦 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/MiguelEstradaLopez/ZoneSport.git
cd ZoneSport
```

### 2. Iniciar la base de datos con Docker
```bash
docker-compose up -d
```

Esto inicia un contenedor PostgreSQL en el puerto `5432` con las siguientes credenciales:
- **Usuario**: `miki_user`
- **Contraseña**: `7667`
- **Base de Datos**: `zonesport_db`

### 3. Instalar dependencias del Backend
```bash
cd server
npm install
```

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
