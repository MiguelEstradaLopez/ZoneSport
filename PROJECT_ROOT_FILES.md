# Archivos de la Raíz del Proyecto - ZoneSport

## 📁 Estructura y Propósito de Cada Archivo

```
ZoneSport/
├── 🤝 CONFIGURACIÓN Y AMBIENTE
│   ├── .env                    ← Secretos y configuración (NO commitear)
│   ├── .env.example            ← Plantilla pública de variables
│   ├── .gitignore              ← Archivos que Git ignora (secretos)
│   ├── .npmrc                  ← Configuración de npm (registry, etc)
│   ├── ENV_CONVENTION.md       ← ESTE DOCUMENTO: Reglas de .env
│   │
│   ├── 🚀 DEPLOYMENT
│   ├── vercel.json             ← Configuración de Vercel (frontend)
│   ├── render.yaml             ← Configuración de Render (backend + DB)
│   ├── .vercelignore           ← Archivos que Vercel ignora
│   ├── .renderignore           ← Archivos que Render ignora
│   │
│   ├── 📚 DOCUMENTACIÓN
│   ├── README.md               ← Inicio rápido y descripción del proyecto
│   ├── SETUP.md                ← Guía completa de instalación
│   ├── FRONTEND.md             ← Documentación del cliente (Next.js)
│   ├── BACKEND.md              ← Documentación del servidor (NestJS)
│   ├── DATABASE.md             ← Esquema y migraciones TypeORM
│   ├── SECURITY.md             ← Prácticas de seguridad
│   ├── DEPLOYMENT.md           ← Pasos para Vercel y Render
│   ├── ENV_CONVENTION.md       ← Este documento (convenciones .env)
│   │
│   ├── 👨‍💻 CÓDIGO Y DATOS
│   ├── docker-compose.yml      ← Servicios Docker (PostgreSQL)
│   ├── package.json (raíz)     ← Scripts globales del proyecto
│   │
│   ├── 📄 ARCHIVOS IMPORTANTES
│   ├── ZoneSport.pdf           ← 🚨 PDF CON PRESENTACIÓN/PROPUESTA
│   │
│   └── 📂 CARPETAS
│       ├── server/             ← Backend (NestJS + TypeORM)
│       ├── client/             ← Frontend (Next.js)
│       └── .git/               ← Historial de Git
```

---

## 📋 Explicación Detallada de Cada Archivo

### 🤝 CONFIGURACIÓN Y AMBIENTE

#### `.env` ⚠️ CRÍTICO
- **Ubicación**: `/home/miki/Proyectos/ZoneSport/.env`
- **Propósito**: Almacenar secrets y configuración sensible
- **Contenido**:
  - Credenciales de base de datos (host, puerto, usuario, contraseña)
  - JWT secret y expiración
  - API keys (Resend, etc.)
  - URLs y puertos
  - Configuración de CORS
  
**REGLA**: Nunca commitear a Git ✅ Está en .gitignore

#### `.env.example` 📖 PÚBLICO
- **Ubicación**: `/home/miki/Proyectos/ZoneSport/.env.example`
- **Propósito**: Documentar qué variables existen sin valores reales
- **Contenido**: Template con placeholders como `your_password_here`

**REGLA**: SIEMPRE está en Git para que nuevos desarrolladores sepan qué configurar

#### `.gitignore` 🔐 PROTECCIÓN
- **Ubicación**: `/home/miki/Proyectos/ZoneSport/.gitignore`
- **Propósito**: Evitar que secretos se commiteen accidentalmente
- **Protege**: `.env`, `.env.local`, `.pem`, `.key`, `node_modules/`, `dist/`

```
# Ejemplo de contenido
.env
.env.local
.env.*.local
*.pem
*.key
node_modules/
```

#### `.npmrc`
- **Ubicación**: `/home/miki/Proyectos/ZoneSport/.npmrc`
- **Propósito**: Configuración de npm a nivel de proyecto
- **Típicamente contiene**:
  - Registry (por defecto o personalizado)
  - Subidas de peer dependencies
  - Configuración de módulos

---

### 🚀 DEPLOYMENT

#### `vercel.json` 🌐 FRONTEND
- **Propósito**: Configurar cómo Vercel despliega el frontend
- **Contiene**:
  - `buildCommand`: `cd client && npm run build`
  - `outputDirectory`: `.next`
  - `root`: `./client` (Vercel sabe dónde está el Next.js)
  - Variables de ambiente

```json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/.next",
  "root": "client"
}
```

#### `render.yaml` 🖥️ BACKEND + DATABASE
- **Propósito**: Configurar cómo Render despliega backend y DB
- **Define 3 servicios**:
  1. Frontend (Node.js + Next.js)
  2. Backend (Node.js + NestJS)
  3. Base de dados (PostgreSQL 16)

#### `.vercelignore` 🚫 FRONTEND CLEANUP
- **Propósito**: Qué archivos ignorar al desplegar en Vercel
- **Típicamente**:
  - `server/` (no necesario en frontend)
  - `.env*` (variables en dashboard de Vercel)
  - `*.md` (documentación local)

#### `.renderignore` 🚫 BACKEND CLEANUP
- **Propósito**: Qué archivos ignorar al desplegar en Render
- **Típicamente**:
  - `.git/`
  - `node_modules/`
  - Archivos compilados

---

### 📚 DOCUMENTACIÓN (8 ARCHIVOS)

#### `README.md` 🎯 INICIO
- **Propósito**: Descripción general del proyecto
- **Contiene**:
  - Definición de ZoneSport
  - Tech stack (Next.js, NestJS, PostgreSQL, etc.)
  - Quick start (3-5 minutos)
  - Features principales
  - Contribución

#### `SETUP.md` 🛠️ INSTALACIÓN
- **Propósito**: Guía paso por paso para configurar en local
- **Pasos**:
  1. Clonar repo
  2. Instalar Node.js, Docker
  3. Ejecutar `docker-compose up`
  4. Crear `.env` desde `.env.example`
  5. Instalar dependencias
  6. Iniciar servidor y cliente

#### `FRONTEND.md` ⚛️ CLIENTE
- **Propósito**: Documentación completa del cliente Next.js
- **Contiene**:
  - Estructura de carpetas
  - Rutas públicas y protegidas (7 rutas totales)
  - Servicios HTTP (authService, usersService, eventsService, etc.)
  - Sistema de diseño (colores, tipografía)
  - Componentes principales
  - Autenticación con JWT
  - Debugging tips

#### `BACKEND.md` 🏗️ SERVIDOR
- **Propósito**: Documentación del servidor NestJS
- **Contiene**:
  - 8 módulos (Auth, Users, Events, Matches, Sports, Classifications, News, Email)
  - 30+ endpoints REST documentados
  - Roles y Guards (ATHLETE, ORGANIZER, ADMIN)
  - Workflows críticos (crear evento, actualizar marcador, reset contraseña)
  - Configuración de TypeORM
  - Seguridad

#### `DATABASE.md` 🗄️ BASE DE DATOS
- **Propósito**: Esquema y migraciones
- **Contiene**:
  - 7 tablas definidas
  - Modelo Entidad-Relación
  - Migraciones TypeORM
  - Estrategia de seed
  - Troubleshooting

#### `SECURITY.md` 🔐 SEGURIDAD
- **Propósito**: Prácticas de seguridad del proyecto
- **Contiene**:
  - Gestión de secretos
  - Cómo generar JWT_SECRET
  - Auditoría de Git
  - Respuesta ante brechas
  - Checklist

#### `DEPLOYMENT.md` 🚀 PASOS DE PRODUCCIÓN
- **Propósito**: Cómo desplegar en Vercel y Render
- **Contiene**:
  - Setup en Vercel (dashboard + CLI)
  - Setup en Render (3 servicios)
  - Variables de ambiente para cada servicio
  - Troubleshooting

#### `ENV_CONVENTION.md` 📝 ESTE DOCUMENTO
- **Propósito**: Establecer convenciones de `.env`
- **Regla Principal**: Todo secreto va en `.env` en raíz

---

### 👨‍💻 CÓDIGO Y DATOS

#### `docker-compose.yml` 🐳 CONTENEDORES
- **Propósito**: Orquestar servicios Docker localmente
- **Define**: PostgreSQL 16 Alpine
- **Configuración**:
  - Puerto: 5432
  - Credenciales: `miki_user` / `7667`
  - Base de datos: `zonesport_db`
  - Volumen: datos persistentes

```yaml
services:
  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: miki_user
      POSTGRES_PASSWORD: 7667
      POSTGRES_DB: zonesport_db
```

#### `package.json` 📦 SCRIPTS (raíz)
- **Propósito**: Scripts globales del proyecto (opcional)
- **Típicamente**:
  - Scripts para instalar ambas partes
  - Scripts para iniciar todo junto
  - Herramientas de desarrollo

---

### 📄 ARCHIVOS IMPORTANTES

#### `ZoneSport.pdf` 🚨 CRÍTICO
- **Ubicación**: `/home/miki/Proyectos/ZoneSport/ZoneSport.pdf`
- **Tamaño**: ~1.1 MB
- **Propósito**: **PRESENTACIÓN OFICIAL DEL PROYECTO**
- **Contenido**: Propuesta, especificaciones, mockups, diagrama de la solución
- **Importante**: Uno de los archivos más valiosos del proyecto

**NO ELIMINAR BAJO NINGÚN CONCEPTO ❌**

Úsalo para:
- Presentar a stakeholders
- Referencia de requisitos
- Documentación de negocio
- Propuestas de inversión

---

## 🎯 RESUMEN VISUAL

| Archivo | Tipo | Público | Commitear | Criticidad |
|---------|------|---------|-----------|-----------|
| `.env` | Config | ❌ NO | ❌ NO | 🔴 CRÍTICO |
| `.env.example` | Template | ✅ SÍ | ✅ SÍ | 🟢 IMPORTANTE |
| `.gitignore` | Config | ✅ SÍ | ✅ SÍ | 🟢 IMPORTANTE |
| `vercel.json` | Deploy | ✅ SÍ | ✅ SÍ | 🟡 ALTO |
| `render.yaml` | Deploy | ✅ SÍ | ✅ SÍ | 🟡 ALTO |
| `README.md` | Docs | ✅ SÍ | ✅ SÍ | 🟡 ALTO |
| `SETUP.md` | Docs | ✅ SÍ | ✅ SÍ | 🟡 ALTO |
| `ZoneSport.pdf` | Negocio | ✅ SÍ | ✅ SÍ | 🔴 CRÍTICO |

---

## 🔍 Verificación Rápida

```bash
# Ver estructura
tree -L 1 -a ZoneSport/

# Verificar que .env está en .gitignore
cat .gitignore | grep "\.env"

# Verificar .env no está en Git
git status | grep .env
# Resultado esperado: (nada)

# Ver contenido de .env.example
cat .env.example

# Ver archivos en raíz
ls -la | grep "^-"
```

---

**DOCUMENTO OFICIAL** 📜  
**FECHA**: 15 de febrero de 2026  
**ESTADO**: Vigente para todos los desarrolladores
