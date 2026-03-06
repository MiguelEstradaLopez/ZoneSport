# 🏆 ZoneSport - Plataforma de Gestión de Eventos Deportivos

**ZoneSport** es una plataforma integral y moderna para la gestión completa de torneos, rankings, partidos y eventos deportivos. Desarrollada con tecnologías actuales, permite a usuarios crear eventos, registrar resultados, seguir clasificaciones en tiempo real y conectar con otros deportistas.

---

## 🎯 Características Principales

✅ **Autenticación segura con JWT** - Registro, login y recuperación de contraseña por email  
✅ **Gestión de eventos/torneos** - Crear, editar y administrar torneos deportivos  
✅ **Sistema de partidos** - Registrar encuentros con resultados en tiempo real  
✅ **Clasificaciones dinámicas** - Tablas de posiciones que se actualizan automáticamente  
✅ **Feed de posts** - Publicar contenido con imágenes, votos (upvote/downvote) y compresión automática  
✅ **Sistema de chat** - Mensajería directa entre amigos con polling en tiempo real (30s)  
✅ **Sistema de amigos** - Agregar/eliminar amigos, lista de amigos con búsqueda  
✅ **Blog y noticias** - Publicar y gestionar contenido sobre eventos  
✅ **Búsqueda de usuarios** - Conectar con otros deportistas en la plataforma  
✅ **Recuperación segura de contraseña** - Tokens con expiración temporal por email  
✅ **Interfaz moderna y responsive** - Funciona en desktop, tablet y móvil (Steam-style dark UI)  
✅ **API REST documentada** - Swagger interactivo para pruebas de endpoints  
✅ **Base de datos robusta** - PostgreSQL con validaciones y relaciones inteligentes  

---

## 🚀 Tech Stack Moderno

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| **Frontend** | Next.js | 16.1.1 |
| **Framework JS** | React | 19.2.3 |
| **Estilos** | Tailwind CSS 4 | 4.0.0 |
| **Lenguaje** | TypeScript | 5.7.3 |
| **Backend** | NestJS | 11.0.1 |
| **ORM** | TypeORM | 0.3.28 |
| **Base de Datos** | PostgreSQL | 16 (Alpine) |
| **Autenticación** | JWT + Bcrypt | Segura |
| **Email** | Resend API | 6.8.0 |
| **HTTP Client** | Axios | 1.13.2 |
| **Iconos** | Lucide React | 0.562.0 |
| **Formularios** | React Hook Form | 7.70.0 |

---

## 📊 Arquitectura General

```
┌──────────────────────────────────────────────┐
│  CLIENTE (FRONTEND)                          │
│  Next.js + React + TypeScript + Tailwind     │
│  http://localhost:3000                       │
└─────────────────────┬────────────────────────┘
                      │
                 API REST
                 (Axios HTTP)
                      │
┌─────────────────────▼────────────────────────┐
│  API (BACKEND)                               │
│  NestJS + TypeORM + PostgreSQL               │
│  http://localhost:3001                       │
│  Docs: http://localhost:3001/api/docs        │
└─────────────────────┬────────────────────────┘
                      │
┌─────────────────────▼────────────────────────┐
│  BASE DE DATOS                               │
│  PostgreSQL 16 (Docker)                      │
│  localhost:5432                              │
└──────────────────────────────────────────────┘
```

---

## ⚡ Inicio Rápido (5 minutos)

### Requisitos Previos

- **Node.js** v18 o superior
- **npm** (incluido con Node.js)
- **Docker** y **Docker Compose**
- **Git**

### Instalación

```bash
# 1. Clonar
git clone https://github.com/MiguelEstradaLopez/ZoneSport.git
cd ZoneSport

# 2. Base de datos
docker-compose up -d

# 3. Backend (Terminal 1)
cd server && npm install && npm run dev

# 4. Frontend (Terminal 2)
cd client && npm install && npm run dev
```

**URLs**: Frontend (<http://localhost:3000>) | Backend (<http://localhost:3001>) | Docs (<http://localhost:3001/api/docs>)

---

## 📚 Documentación Detallada

### 🔧 [SETUP.md](SETUP.md) - Guía Completa de Configuración

Incluye:

- Instalación detallada paso a paso
- Configuración de variables de entorno (.env)
- Setup de base de datos (Docker vs local)
- Medidas de seguridad implementadas
- Generación de claves JWT
- Comandos de desarrollo
- Solución de problemas (Troubleshooting)

### 🖥️ [BACKEND.md](BACKEND.md) - Documentación del Backend

Incluye:

- Estructura de módulos NestJS completa
- Descripción de cada entidad de base de datos
- Referencia de API REST (todos los endpoints)
- Explicación de autenticación JWT
- Cómo crear nuevas rutas y controladores
- Convenciones de código
- Cómo ejecutar tests

### 💻 [FRONTEND.md](FRONTEND.md) - Documentación del Frontend

Incluye:

- Estructura de carpetas y componentes
- Sistema CSS con clases semánticas
- Paleta de colores corporativa
- Componentes disponibles
- Servicios HTTP para consumo de API
- Cómo crear nuevas páginas
- Convenciones de código

---

## 🏗️ Estructura del Proyecto Completa

```
ZoneSport/
├── server/                          # Backend NestJS
│   ├── src/
│   │   ├── auth/                   # Módulo de autenticación (JWT)
│   │   ├── users/                  # Gestión de usuarios y perfiles
│   │   ├── events/                 # Gestión de eventos
│   │   ├── matches/                # Gestión de partidos
│   │   ├── tournaments/            # Gestión de torneos
│   │   ├── sports/                 # Catálogo de deportes
│   │   ├── classifications/        # Tablas de clasificación
│   │   ├── news/                   # Blog y noticias
│   │   ├── posts/                  # Feed de posts con votos
│   │   ├── chats/                  # Sistema de mensajería
│   │   ├── friendships/            # Sistema de amigos
│   │   ├── notifications/          # Notificaciones
│   │   ├── email/                  # Servicio de email
│   │   ├── database/               # Configuración DB y seeds
│   │   ├── main.ts                 # Punto de entrada
│   │   └── app.module.ts           # Módulo raíz
│   ├── test/                       # Tests E2E
│   ├── .env                        # Variables de entorno (NO commitar)
│   ├── .env.example                # Template (SÍ commitar)
│   └── package.json
│
├── client/                          # Frontend Next.js 16+
│   ├── app/
│   │   ├── page.tsx               # Home con feed de posts
│   │   ├── layout.tsx             # Layout global
│   │   ├── globals.css            # Estilos globales (Tailwind)
│   │   ├── login/                 # Página de login
│   │   ├── registrar/             # Registro de usuarios
│   │   ├── eventos/               # Listado y detalle de eventos
│   │   ├── crear-evento/          # Formulario crear evento
│   │   ├── clasificacion/         # Tablas de posiciones
│   │   ├── noticias/              # Blog de noticias
│   │   ├── chats/                 # Mensajería directa
│   │   ├── perfil/                # Perfil de usuario
│   │   ├── olvide-contrasena/     # Recuperar contraseña
│   │   ├── reset-password/        # Resetear con token
│   │   └── social/                # Búsqueda de usuarios/amigos
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.tsx         # Barra de navegación
│   ├── services/
│   │   ├── api.ts                 # Cliente HTTP base (Axios)
│   │   ├── authService.ts         # Servicio de autenticación
│   │   ├── eventsService.ts       # Servicio de eventos
│   │   ├── matchesService.ts      # Servicio de partidos
│   │   ├── sportsService.ts       # Servicio de deportes
│   │   ├── classificationsService.ts
│   │   ├── tournamentsService.ts  # Servicio de torneos
│   │   ├── usersService.ts        # Servicio de usuarios
│   │   └── newsService.ts         # Servicio de noticias
│   ├── context/
│   │   └── AuthContext.tsx        # Context de autenticación
│   ├── public/                    # Archivos estáticos
│   ├── next.config.ts             # Configuración Next.js
│   ├── tailwind.config.ts         # Configuración Tailwind
│   ├── tsconfig.json              # Configuración TypeScript
│   └── package.json
│
├── docker-compose.yml               # Docker para PostgreSQL
├── README.md                        # Este archivo
├── SETUP.md                         # Guía de instalación y configuración
├── BACKEND.md                       # Documentación del backend
├── FRONTEND.md                      # Documentación del frontend
├── IMPORTANT.md                     # Información crítica y deployment
└── DEPLOYMENT_CONFIG.md             # Guía de deployment (Render + Vercel)
```

---

## 🔐 Seguridad Implementada

El proyecto implementa múltiples capas de seguridad:

- ✅ **Credenciales protegidas** - Todas en variables de entorno `.env`
- ✅ **Contraseñas hasheadas** - Bcrypt con 10 rounds
- ✅ **Tokens JWT** - Con expiración controlada
- ✅ **CORS configurado** - Solo orígenes permitidos
- ✅ **Validación de entrada** - DTOs en frontend y backend
- ✅ **SQL Injection prevention** - TypeORM con queries preparadas
- ✅ **Helmet.js** - Headers HTTP de seguridad
- ✅ **Recuperación segura** - Tokens temporales con expiración

---

## 🎨 Paleta de Colores

| Color | Código | Uso |
|-------|--------|-----|
| Azul ZoneSport | #0d47a1 | Botones, enlaces |
| Azul Claro | #1e88e5 | Hover states |
| Verde Lima | #7cb342 | Acciones positivas |
| Verde Claro | #9ccc65 | Hover success |
| Fondo Oscuro | #0f172a | Fondo principal |
| Fondo Más Oscuro | #0a0f1a | Fondos secundarios |
| Texto Principal | #ffffff | Texto base |
| Texto Secundario | #b0b0b0 | Etiquetas |
| Bordes | #1e293b | Separadores |

---

## 🛠️ Comandos Principales

### Backend

```bash
npm run dev          # Modo desarrollo (watch)
npm run build        # Compilar para producción
npm start            # Ejecutar producción
npm test           # Tests unitarios
npm run test:cov    # Tests con cobertura
npm run lint        # ESLint
npm run format      # Prettier
```

### Frontend

```bash
npm run dev          # Modo desarrollo
npm run build        # Compilar para producción
npm start            # Ejecutar producción
npm run lint        # ESLint
```

---

## 📱 Responsive Design

Optimizado para:

- 📱 Móviles
- 📱 Tablets
- 💻 Laptops
- 🖥️ 4K

---

## 📞 Soporte

- **Documentación**: [SETUP.md](SETUP.md), [BACKEND.md](BACKEND.md), [FRONTEND.md](FRONTEND.md)
- **API interactiva**: <http://localhost:3001/api/docs>
- **Issues**: GitHub

---

## 📄 Licencia

Licencia privada. © 2026 ZoneSport
