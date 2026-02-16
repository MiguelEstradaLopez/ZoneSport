# ⚠️ INFORMACIÓN CRÍTICA - ZoneSport

Documento consolidado con configuración, seguridad, base de datos y deployment. Lee esto después de README, SETUP, FRONTEND y BACKEND.

---

## 📋 Tabla de Contenidos

1. [Configuración de Workspaces](#1--configuración-de-workspaces)
2. [Variables de Entorno](#2--variables-de-entorno-y-seguridad)
3. [Base de Datos](#3--base-de-datos-y-migraciones)
4. [Deployment en Render + Vercel](#4--deployment-en-render--vercel)
5. [Estructura de Archivos](#5--estructura-de-archivos)

---

## 1. � Configuración de Workspaces

### NPM Workspaces en Raíz

El `package.json` en raíz gestiona ambos subproyectos:

```json
{
  "name": "zonesport",
  "workspaces": ["server", "client"],
  "scripts": {
    Backend: server/.env.example

```env
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=zonesport_user
DATABASE_PASSWORD=your_secure_password_here_min_16_chars
DATABASE_NAME=zonesport_db
DATABASE_URL=postgresql://...

# JWT Secrets (generar con: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here_min_32_chars
JWT_RESET_SECRET=your_reset_secret_here_min_32_chars

# Server
NODE_ENV=development
PORT=3001  ← Dinámico! Render lo cambia a 10000+

# CORS (para Vercel en producción)
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
SENDER_EMAIL=noreply@zonesport.com
```

### Frontend: client/.env.example

```env
# DEBE TENER PREFIJO NEXT_PUBLIC_ para accesibilidad en navegador
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Generar Secretos Seguros

```bash
# JWT_SECRET (32 caracteres mínimo)
openssl rand -base64 32

# Contraseña BD (16 caracteres mínimo)
openssl rand -base64 16
```

### Verificación Antes de Cada Commit

```bash
# 1. Confirmar que .env no está en Git
git status | grep ".env"
# Resultado: (nada)

# 2. Buscar secretos hardcodeados
git diff --cached | grep -E "password=|secret=|api.key="
# Result= process.env.JWT_SECRET;
```

### Estructura del .env

```env
# DATABASE
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=miki_user
DATABASE_PASSWORD=7667
DATABASE_NAME=zonesport_db
DATABASE_URL=postgresql://miki_user:7667@localhost:5432/zonesport_db

# AUTHENTICATION
JWT_SECRET=generate_with_openssl_rand_-base64_32
JWT_EXPIRATION=24h

# SERVER
SERVER_PORT=3001
NODE_ENV=development

# CORS & FRONTEND
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# E3AIL (opcional)
RESEND_API_KEY=your-resend-api-key-here
SENDER_EMAIL=noreply@zonesport.com
```

### Generar Secretos Seguros

```bash
# JWT_SECRET (copiar output)
openssl rand -base64 32

# Contraseña BD segura (mínimo 16 caracteres)
openssl rand -base64 16
```

### Variables Públicas vs Sensibles

| Variable | Pública | Lugar | Razón |
|----------|---------|-------|-------|
| `DATABASE_PASSWORD` | ❌ NO | `.env` solamente | Es unaCredencial |
| `JWT_SECRET` | ❌ NO | `.env` solamente | Es un Secreto |
| `NEXT_PUBLIC_API_URL` | ✅ SÍ | `.env` + navigador | El cliente necesita saber dónde está el API |
| `RESEND_API_KEY` | ❌ NO | `.env` solamente | Es una API Key |

### Checklist Antes de Cada Commit

```bash
# 1. Verificar que .env está en .gitignore
grep "^\.env" .gitignore

# 2. Verificar que .env NO está staged
git status | grep "\.env"
# Resultado esperado: (nada)

# 3. Buscar secretos en cambios
git diff --cached | grep -E "password|secret|api.key"
# Resultado esperado: (nada)

# 4. Buscar valores hardcodeados
grep -r "PASSWORD=" server/src/ client/app/ | grep -v ".env"
# Resultado esperado: (nada)
```

---

## 2. 🗄️ Base de Datos y Migraciones

### Esquema de 7 Tablas

```
users
├── id (PK)
├── email (UNIQUE)
├── password (bcrypted)
├── firstName, lastName, phone
├── role (ENUM: ATHLETE, ORGANIZER, ADMIN)
└── createdAt, updatedAt

sports
├── Ubicación de Migraciones

```
server/src/migrations/
├── 1708000001000-CreateUsersTable.ts
├── 1708000002000-CreateSportsTable.ts
├── 1708000003000-CreateEventsTable.ts
├── 1708000004000-CreateMatchesTable.ts
├── 1708000005000-CreateClassificationsTable.ts
├── 1708000006000-CreateNewsTable.ts
└── 1708000007000-CreatePasswordResetTokenTable.ts
```

### Configuración de Migraciones

**Desarrollo** (app.module.ts):
```typescript
synchronize: true        // Crea tablas automáticamente
autoLoadEntities: true
```

**Producción** (app.module.ts):
```typescript
synchronize: false       // ❌ NUNCA en producción
migrations: ['dist/migrations/*.js']
migrationsRun: true      // Ejecuta migraciones al iniciar
### Migraciones TypeORM

Ubicación: `server/src/migrations/`

```bash
# Ver estado de migraciones
npm run typeorm:show

# Aplicar migraciones
npm run typeorm:run

# Crear nueva migración
npm run typeorm:create -- src/migrations/NombreMigracion

# Revertir última migración
npm run typeorm:drop
```

### Cambios a la BD (desarrollo vs producción)

**Desarrollo** (`app.module.ts`):

```typescript
syn4. 🚀 Deployment en Render + Vercel

### A. Render Backend (NestJS + PostgreSQL)

#### Paso 1: Crear Base de Datos en Render

1. Ir a [render.com](https://render.com)
2. Dashboard → Create → PostgreSQL
3. **Database**: `zonesport`
4. **User**: `zonesport_user`
5. Render genera contraseña automáticamente
6. Copiar `Internal Database URL`

#### Paso 2: Crear Servicio Node.js (Backend)

1. Dashboard → Create → Web Service
2. **Connect Repository**: Seleccionar ZoneSport
3. **Name**: `zonesport-api`
4. **Environment**: Node
5. **Build Command**: Copiar exacto de abajo 👇
6. **Start Command**: Copiar exacto de abajo 👇
7. **Root Directory**: `server/` ← IMPORTANTE

#### Build Command (EXACTO)

```bash
npm run build:server
```

#### Start Command (EXACTO)

```bash
cd server && npm run start:prod
```

#### Environment Variables en Render

| Variable | Valor | Tipo |
|----------|-------|------|
| `PORT` | `3001` | Public |
| `NODE_ENV` | `production` | Public |
| `DATABASE_URL` | De PostgreSQL arriba | Secret |
| `JWT_SECRET` | `openssl rand -base64 32` | Secret |
| `JWT_RESET_SECRET` | `openssl rand -base64 32` | Secret |
| `FRONTEND_URL` | `https://zonesport.vercel.app` | Public |
| `CORS_ORIGIN` | `https://zonesport.vercel.app` | Public |
| `RESEND_API_KEY` | Tu API key | Secret |
| `SENDER_EMAIL` | `noreply@yourdomain.com` | Public |

#### Test Render Backend

Una vez deployado:
```bash
curl https://zonesport-api.render.com
# Resultado: 404 OK (backend está up)

curl https://zonesport-api.render.com/api/docs
# Resultado: Swagger UI disponible
```

---
5. 📂 Estructura de Archivos Raíz

### Configuración (NO modificar)

```
.env                 ← (NO existe, cada dev tiene su copia local)
.env.example         ← (NO existe, ver server/ y client/)
.gitignore           ← Protege .env automáticamente
.npmrc               ← Config npm
docker-compose.yml   ← PostgreSQL local
```

### Documentación (5 archivos)

```
README.md            ← 1. QUÉ es ZoneSport
SETUP.md             ← 2. CÓMO instalar localmente
FRONTEND.md          ← 3. CÓMO funciona React/Next.js
BACKEND.md           ← 4. CÓMO funciona NestJS
IMPORTANT.md         ← 5. ESTE ARCHIVO (deploy, seguridad, BD)
```

### Carpetas

```
server/              ← Backend NestJS
  ├── src/
  ├── .env.example   ← Template (commitear)
  ├── .env           ← Valores locales (NO commitear)
  └── package.json
client/              ← Frontend Next.js
  ├── app/
  ├── .env.example   ← Template (commitear)
  ├── .env.local     ← Valores locales (NO commitear)
  └── package.json
```

---

## 🔍 Referencia Rápida

### Iniciar Full Stack Local

```bash
# Terminal 1: Base de datos
npm run docker:up

# Terminal 2: Backend (puerto 3001)
npm run dev:server

# Terminal 3: Frontend (puerto 3000)
npm run dev:client

# Abrir
open http://localhost:3000
```

### Antes de Hacer Push a Producción

```bash
# 1. Verificar no hay secretos
git diff --cached | grep -E "password|secret|api"

# 2. Build local funciona
npm run build:server && npm run build:client

# 3. .env NO está in staged
git status | grep ".env"

# 4. Commit y push
git add -A
git commit -m "..."
git push origin main
```

### URLs de Administración

| Servicio | URL | Admin |
|----------|-----|-------|
| GitHub Repo | github.com/MiguelEstradaLopez/ZoneSport | |
| Render Dashboard | render.com | Backend |
| Vercel Dashboard | vercel.com | Frontend |
| Local Backend API | http://localhost:3001/api/docs | Swagger |
| Local Frontend | http://localhost:3000 | |

---

**ÚLTIMA ACTUALIZACIÓN**: 15 de febrero de 2026  
**ORDEN DE LECTURA**: README → SETUP → FRONTEND → BACKEND → IMPORTANT
| Archivo | Propósito | Público |
|---------|-----------|---------|
| `.env` | Secretos locales | ❌ NO (en .gitignore) |
| `.env.example` | Template de variables | ✅ SÍ |
| `.gitignore` | Protege .env | ✅ SÍ |
| `.npmrc` | Config npm | ✅ SÍ |

### Deployment (modificar para tu proyecto)

| Archivo | Propósito |
|---------|-----------|
| `vercel.json` | Config de Vercel (frontend) |
| `render.yaml` | Config de Render (backend) |
| `.vercelignore` | Qué ignorar en Vercel |
| `.renderignore` | Qué ignorar en Render |

### Documentación (4 principales + este)

| Archivo | Lee primero | Propósito |
|---------|-----------|-----------|
| `README.md` | ✅ 1 | Qué es ZoneSport |
| `SETUP.md` | ✅ 2 | Cómo instalar localmente |
| `FRONTEND.md` | ✅ 3 | Cómo funciona React/Next.js |
| `BACKEND.md` | ✅ 4 | Cómo funciona NestJS |
| `IMPORTANT.md` | ✅ 5 | Seguridad, BD y Deployment (este) |

### Infraestructura

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.yml` | PostgreSQL local en Docker |
| `package.json` | Scripts globales (si existen) |

### Crítico

| Archivo | Descripción |
|---------|-----------|
| `ZoneSport.pdf` | 🚨 Presentación oficial. **NO ELIMINAR** |

---

## 🔍 Referencia Rápida

### Iniciar proyecto completo

```bash
# Terminal 1: Base de datos
docker-compose up -d

# Terminal 2: Backend
cd server && npm install && npm run start:dev

# Terminal 3: Frontend
cd client && npm install && npm run dev
```

### Ver estado

```bash
# PostgreSQL corriendo
docker ps | grep postgres

# Backend en puerto 3001
curl http://localhost:3001

# Frontend en puerto 3000
open http://localhost:3000
```

### Secretos en Render

```bash
# Crear JWT_SECRET
openssl rand -base64 32
# Copiar a Render Dashboard > Environment > JWT_SECRET

# Crear contraseña BD
openssl rand -base64 16
# Usar en DATABASE_PASSWORD
```

### URLs importantes

- **Local Frontend**: <http://localhost:3000>
- **Local Backend**: <http://localhost:3001>
- **Vercel Dashboard**: <https://vercel.com>
- **Render Dashboard**: <https://render.com>
- **GitHub**: <https://github.com/MiguelEstradaLopez/ZoneSport>

---

**ÚLTIMA ACTUALIZACIÓN**: 15 de febrero de 2026  
**TODOS LOS DESARROLLADORES DEBEN LEER: README → SETUP → FRONTEND → BACKEND → IMPORTANT**
