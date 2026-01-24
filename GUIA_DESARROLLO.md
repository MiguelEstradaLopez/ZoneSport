# 📖 Guía de Desarrollo - ZoneSport

Documentación completa para desarrolladores. Consolidada desde múltiples guías.

---

## 📚 Tabla de Contenidos

1. [Inicio Rápido](#-inicio-rápido)
2. [Arquitectura](#-arquitectura)
3. [Autenticación](#-autenticación)
4. [Recuperación de Contraseña](#-recuperación-de-contraseña)
5. [API Endpoints](#-api-endpoints)
6. [Seguridad y Variables de Entorno](#-seguridad-y-variables-de-entorno)
7. [Troubleshooting](#-troubleshooting)

---

## 🚀 Inicio Rápido

### Configuración Inicial

```bash
# 1. Clonar y entrar al proyecto
git clone https://github.com/MiguelEstradaLopez/ZoneSport.git
cd ZoneSport

# 2. Iniciar base de datos PostgreSQL con Docker
docker-compose up -d

# 3. Backend
cd server
cp .env.example .env           # Copiar template (editar con valores locales)
npm install
npm run start:dev              # Iniciará en http://localhost:3001

# 4. Frontend (en otra terminal)
cd client
npm install
npm run dev                    # Iniciará en http://localhost:3000
```

### URLs Locales

- **Frontend**: <http://localhost:3000>
- **Backend**: <http://localhost:3001>
- **Base Datos**: localhost:5432

### Usuario de Prueba

```
Email: test@example.com
Contraseña: password123
Rol: ATHLETE (por defecto)
```

---

## 🏗️ Arquitectura

### Stack Tecnológico

**Backend**

- NestJS 11.0.1 (Framework Node.js)
- TypeORM 0.3.28 (ORM SQL)
- PostgreSQL 16 (Base de datos)
- JWT + Bcrypt (Autenticación)
- Nodemailer (Envío de emails)

**Frontend**

- Next.js 16.1.1 (React Framework)
- React 19.2.3 (UI Library)
- TypeScript 5.x (Type Safety)
- Tailwind CSS 4.0 (Styling)
- Axios (HTTP Client)

### Estructura de Carpetas

```
server/src/
├── auth/                      # Autenticación JWT, recuperación contraseña
│   ├── entities/
│   │   └── password-reset-token.entity.ts
│   ├── dtos/
│   ├── strategies/            # JWT Strategy
│   ├── guards/               # JWT Guard, Roles Guard
│   ├── decorators/           # @CurrentUser, @Roles
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── auth.module.ts
├── users/                     # Gestión de usuarios
├── events/                    # Gestión de eventos/torneos
├── matches/                   # Gestión de partidos
├── sports/                    # Catálogo de deportes
├── classifications/           # Tablas de posiciones
├── news/                      # Blog y noticias
├── email/                     # Servicio SMTP
└── app.module.ts

client/app/
├── page.tsx                   # Home
├── login/page.tsx
├── registrar/page.tsx
├── eventos/page.tsx
├── eventos/[id]/page.tsx
├── noticias/page.tsx
├── clasificacion/page.tsx
├── perfil/page.tsx
├── olvide-contrasena/page.tsx
├── reset-password/[token]/page.tsx
└── layout.tsx

components/
└── layout/
    └── Navbar.tsx             # Navegación principal
```

---

## 🔐 Autenticación

### Flujo de Registro

```
1. Usuario llena formulario en /registrar
2. Frontend valida: email, contraseña (6+ chars), nombre, teléfono
3. POST /auth/register envía datos
4. Backend verifica email único, hashea contraseña (bcrypt)
5. Usuario creado con rol ATHLETE por defecto
6. Retorna JWT token y datos del usuario
7. Token guardado en localStorage
8. Redirige a home
```

### Flujo de Login

```
1. Usuario accede a /login
2. Ingresa email y contraseña
3. POST /auth/login
4. Backend valida credenciales
5. Retorna JWT token (24h expiración)
6. Token guardado en localStorage
7. Axios interceptor agrega token a todas las peticiones
8. Redirige a home
```

### Endpoints de Autenticación

```
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+57123456789" (opcional)
}

POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

GET /auth/profile (JWT requerido)
Retorna datos del usuario autenticado

GET /users/search/email?email=xxx (JWT requerido)
Busca usuarios por email
```

### Guards y Decoradores

**@UseGuards(JwtAuthGuard)**

```typescript
@Post('create')
@UseGuards(JwtAuthGuard)
async create(@CurrentUser() user: User) {
  // Solo usuarios autenticados
}
```

**@Roles()**

```typescript
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ORGANIZER, UserRole.ADMIN)
async delete(@Param('id') id: number) {
  // Solo ORGANIZER o ADMIN
}
```

---

## 🔑 Recuperación de Contraseña

### Flujo Completo

```
1. Usuario en /login → "¿Olvidaste tu contraseña?"
2. Accede a /olvide-contrasena
3. Ingresa email registrado
4. Backend genera JWT (1h expiración)
5. Guarda token en tabla password_reset_tokens
6. Envía email con enlace + token
7. Usuario hace click → /reset-password/[token]
8. Token validado automáticamente
9. Usuario ingresa nueva contraseña
10. Backend hashea y actualiza
11. Token eliminado de BD
12. Redirige a /login
```

### Endpoints

```
POST /auth/forgot-password
{
  "email": "user@example.com"
}
Response:
{
  "message": "Si el email existe, recibirás un enlace de recuperación"
}

GET /auth/validate-reset-token/:token
Valida token sin cambiar contraseña
Response:
{
  "email": "user@example.com",
  "firstName": "Juan"
}

POST /auth/reset-password
{
  "token": "eyJhbGc...",
  "newPassword": "newPass123"
}
Response:
{
  "message": "Tu contraseña ha sido actualizada exitosamente"
}
```

### Configuración de Email

La plataforma usa Nodemailer para enviar emails.

**Variables requeridas en .env:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=app-specific-password
SMTP_FROM=noreply@zonesport.com
FRONTEND_URL=http://localhost:3000
```

**Para Gmail con 2FA:**

1. Habilitar 2FA en tu cuenta Google
2. Ir a myaccount.google.com/apppasswords
3. Generar contraseña para "Mail" y "Windows"
4. Usar esa contraseña en SMTP_PASSWORD

---

## 📡 API Endpoints

### Usuarios

```
GET /users                     # Listar usuarios
GET /users/:id                 # Obtener usuario por ID
POST /users                    # Crear usuario
PATCH /users/:id               # Actualizar usuario
DELETE /users/:id              # Eliminar usuario
GET /users/search/email?email=xxx  # Buscar por email (JWT)
```

### Eventos

```
GET /events                    # Listar eventos
GET /events/:id                # Obtener evento
POST /events                   # Crear evento (JWT)
PATCH /events/:id              # Editar evento (solo organizador)
DELETE /events/:id             # Eliminar evento (solo organizador)
```

### Partidos

```
GET /matches                   # Listar partidos
GET /matches/:id               # Obtener partido
POST /matches                  # Crear partido
PATCH /matches/:id             # Actualizar partido
DELETE /matches/:id            # Eliminar partido
```

### Clasificaciones

```
GET /classifications           # Listar clasificaciones
GET /classifications/:id       # Obtener clasificación
POST /classifications          # Crear clasificación
```

### Noticias

```
GET /news                      # Listar noticias (público)
GET /news/:id                  # Obtener noticia
POST /news                     # Crear noticia (JWT)
PATCH /news/:id                # Editar noticia (solo autor)
DELETE /news/:id               # Eliminar noticia (solo autor)
```

### Deportes

```
GET /sports                    # Listar deportes
POST /sports                   # Crear deporte
```

---

## 🔐 Seguridad y Variables de Entorno

### Principios de Seguridad

❌ **NUNCA**

- Hardcodear credenciales en el código
- Commitar `.env` a Git
- Subir contraseñas a GitHub
- Usar contraseñas simples en producción

✅ **SIEMPRE**

- Usar `.env` local (protegido en .gitignore)
- Mantener `.env.example` con valores genéricos
- Generar secretos seguros para producción
- Usar variables de entorno para todas las credenciales

### Estructura de Seguridad

```
server/
├── .env              ← LOCAL (NO en Git)
├── .env.example      ← EN Git (plantilla)
└── .gitignore        ← Protege .env
```

### Archivo .env (Desarrollo)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=miki_user
DB_PASSWORD=7667
DB_NAME=zonesport_db

# JWT
JWT_SECRET=miki_secreto_2026_antioquia
JWT_RESET_SECRET=miki_reset_secreto_2026_antioquia

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=app-specific-password
SMTP_FROM=noreply@zonesport.com

# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Archivo .env.example (Plantilla)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres_user
DB_PASSWORD=secure_password_here
DB_NAME=zonesport_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_RESET_SECRET=your-secret-reset-token-key-change-in-production

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com

# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Generador de Secretos Seguros

```bash
# Para JWT_SECRET (generar 32 caracteres random)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Para contraseñas seguras
openssl rand -base64 32
```

### Producción (Proton Hosting)

En lugar de cambiar código, solo inyecta variables diferentes en el panel:

```env
NODE_ENV=production
DB_HOST=db.protonhosted.com
DB_PASSWORD=contraseña-muy-segura-generada-por-proton
JWT_SECRET=clave-criptografica-segura-32-caracteres
SMTP_USER=email-produccion@dominio.com
CORS_ORIGIN=https://midominio.com
```

**Ventaja**: Mismo código, diferentes variables por entorno.

---

## 🐛 Troubleshooting

### Backend no inicia

```bash
# Error: "ECONNREFUSED" en DB
# Solución: Verificar que Docker está corriendo
docker-compose up -d

# Error: Puerto 5432 en uso
# Solución: Cambiar puerto en docker-compose.yml o docker-compose down

# Error: "Cannot find module"
# Solución:
npm install
npm run build
```

### Frontend no carga

```bash
# Error: "CORS error"
# Solución: Backend debe estar corriendo
# Verificar CORS en main.ts

# Error: "API calls failing"
# Solución:
# - Verificar que backend está en http://localhost:3001
# - Revisar console del navegador
# - Revisar Network tab del DevTools
```

### Email no se envía

```bash
# Verificar variables SMTP en .env:
- SMTP_HOST correcto
- SMTP_PORT correcto (587 para Gmail)
- SMTP_USER y SMTP_PASSWORD correctos
- Para Gmail: usar "Contraseña de app" no la contraseña regular

# Test con curl:
curl -X POST http://localhost:3001/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Token JWT expirado

```
Error: "Unauthorized"
Solución: 
- Token dura 24 horas
- Logout y login nuevamente
- O generar nuevo token
```

### Base de datos con errores

```bash
# Resetear base de datos
docker-compose down -v
docker-compose up -d

# Entrar a la BD
docker-compose exec db psql -U miki_user -d zonesport_db
```

---

## 📝 Convenciones de Código

### Naming Conventions

```typescript
// Interfaces/Types - PascalCase
interface User { ... }
type CreateUserDto = { ... }

// Classes - PascalCase
class UsersService { ... }

// Methods/Functions - camelCase
async createUser() { ... }
private validateEmail() { ... }

// Constants - UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// Variables - camelCase
let userEmail = "";
const isAuthenticated = true;
```

### Estructura de Módulo NestJS

```typescript
// module.ts
@Module({
  imports: [...],
  controllers: [...],
  providers: [...],
  exports: [...],
})
export class ExampleModule {}

// service.ts
@Injectable()
export class ExampleService { ... }

// controller.ts
@Controller('example')
export class ExampleController { ... }
```

---

## 🔄 Git Workflow

```bash
# Crear rama para feature
git checkout -b feature/descripcion

# Hacer cambios
git add .
git commit -m "feat: descripción clara del cambio"

# Subir rama
git push origin feature/descripcion

# Crear Pull Request en GitHub
# Esperar revisión y merge

# Actualizar main local
git checkout main
git pull origin main
```

### Commit Messages

```
feat: Agregar nueva feature
fix: Corregir bug
docs: Actualizar documentación
style: Cambios de formato
refactor: Refactorizar código
test: Agregar o actualizar tests
chore: Tareas de mantenimiento
```

---

## 📚 Recursos Útiles

- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeORM Docs](https://typeorm.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Última actualización**: 23 de enero de 2026  
**Versión**: 1.0  
**Mantener actualizado**: Sí
