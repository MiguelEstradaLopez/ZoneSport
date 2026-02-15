# ⚠️ INFORMACIÓN CRÍTICA - ZoneSport

Documento consolidado con información de seguridad, base de datos, deployment y estructura de archivos. Lee esto después de README, SETUP, FRONTEND y BACKEND.

---

## 📋 Tabla de Contenidos

1. [Variables de Entorno y Seguridad](#1--variables-de-entorno-y-seguridad)
2. [Base de Datos y Migraciones](#2--base-de-datos-y-migraciones)
3. [Deployment en Producción](#3--deployment-en-producción)
4. [Archivos de la Raíz](#4--archivos-de-la-raíz)

---

## 1. 🔐 Variables de Entorno y Seguridad

### REGLA DE ORO

```
✅ TODO lo inseguro va en .env
❌ .env NUNCA se commitea a Git (está en .gitignore)
✅ Solo UN .env en la raíz
✅ Un .env.example también en la raíz (PÚBLICO)
```

### Secretos que NO van en el código

```typescript
// ❌ NUNCA hacer esto
const DB_PASSWORD = "7667";
const JWT_SECRET = "mi-secret-super-secreto";

// ✅ SIEMPRE así
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
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

# EMAIL (opcional)
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
├── id (PK)
├── name (UNIQUE)
├── description
└── classificationRules (JSON)

events
├── id (PK)
├── name, description
├── status (ENUM: SCHEDULED, IN_PROGRESS, FINISHED)
├── startDate, endDate
├── organizerId (FK → users)
├── sportId (FK → sports)
└── createdAt, updatedAt

matches
├── id (PK)
├── teamA, teamB
├── scoreA, scoreB
├── status (ENUM: SCHEDULED, IN_PROGRESS, PLAYED)
├── scheduledDate
├── eventId (FK → events CASCADE)
└── createdAt, updatedAt

classifications (rankings)
├── id (PK)
├── teamName, points, wins, draws, losses, goalsFor, goalsAgainst, position
├── eventId (FK → events CASCADE)
├── UNIQUE(eventId, teamName)
└── createdAt, updatedAt

news
├── id (PK)
├── title, content, summary
├── imageUrl
├── authorId (FK → users CASCADE)
└── createdAt, updatedAt

password_reset_token
├── id (PK)
├── token (UNIQUE)
├── userId (FK → users CASCADE)
├── expiresAt
└── createdAt
```

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
synchronize: true  // ✅ Crea/sincroniza tablas automáticamente
autoLoadEntities: true
```

**Producción**: 
```typescript
synchronize: false  // ❌ Nunca en producción
migrations: ['dist/migrations/*.js']
migrationsRun: true  // Ejecuta migraciones al iniciar
```

### Datos Iniciales (Seed)

Crear archivos de seed en `server/src/seeds/` si necesitas datos iniciales:

```typescript
// sports.seed.ts
const sports = [
  { name: 'Fútbol', description: 'Soccer' },
  { name: 'Baloncesto', description: 'Basketball' },
];
```

---

## 3. 🚀 Deployment en Producción

### Render Backend + Base de Datos

1. **Crear servicio PostgreSQL en Render**
   - Dashboard → Create → PostgreSQL
   - Nombre: `zonesport-db`
   - Plan: Standard (recomendado)
   - Copiar conexión: `postgresql://...`

2. **Crear servicio Node.js (Backend) en Render**
   - Dashboard → Create → Web Service
   - Conectar repo GitHub (ZoneSport)
   - Build command: `npm install && cd server && npm run build`
   - Start command: `cd server && npm run start:prod`
   - Environment variables:
     ```
     DATABASE_URL=postgresql://... (de PostgreSQL)
     JWT_SECRET=(generar con openssl)
     NODE_ENV=production
     CORS_ORIGIN=https://tu-frontend.vercel.app
     ```

3. **Variable CORS importante**
   - `CORS_ORIGIN` debe ser la URL de Vercel
   - Ejemplo: `https://zonesport.vercel.app`

### Vercel Frontend

1. **Conectar repo en Vercel**
   - Dashboard → Add New → Project
   - Seleccionar ZoneSport
   - Framework: Next.js
   - Root directory: `./client`

2. **Environment Variables en Vercel**
   ```
   NEXT_PUBLIC_API_URL=https://zonesport-api.render.com
   ```
   (Reemplazar con tu URL de Render backend)

3. **Deploy automático**
   - Vercel deploya cada push a `main`
   - URL: `https://zonesport.vercel.app` (o similar)

### Checklist antes de desplegar

- [ ] `.env` NO está en Git
- [ ] `.env.example` tiene la estructura correcta
- [ ] JWT_SECRET fue generado con `openssl`
- [ ] DATABASE_PASSWORD tiene mínimo 16 caracteres
- [ ] CORS_ORIGIN apunta a Vercel (sin trailing slash)
- [ ] Backend está construyendo correctamente localmente
- [ ] Variables de entorno están en los dashboards (Render + Vercel)
- [ ] Migraciones están listas: `server/src/migrations/*`

---

## 4. 📂 Archivos de la Raíz

### Configuración (NO modificar generalmente)

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

- **Local Frontend**: http://localhost:3000
- **Local Backend**: http://localhost:3001
- **Vercel Dashboard**: https://vercel.com
- **Render Dashboard**: https://render.com
- **GitHub**: https://github.com/MiguelEstradaLopez/ZoneSport

---

**ÚLTIMA ACTUALIZACIÓN**: 15 de febrero de 2026  
**TODOS LOS DESARROLLADORES DEBEN LEER: README → SETUP → FRONTEND → BACKEND → IMPORTANT**
