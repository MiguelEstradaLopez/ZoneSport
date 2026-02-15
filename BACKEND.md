# 🖥️ Documentación Backend - ZoneSport

Guía completa para entender, trabajar y desarrollar el backend de ZoneSport.

---

## 📋 Tabla de Contenidos

1. [Introducción](#-introducción)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Módulos Principales](#-módulos-principales)
4. [API REST](#-api-rest)
5. [Autenticación JWT](#-autenticación-jwt)
6. [Base de Datos](#-base-de-datos)
7. [Comandos Disponibles](#-comandos-disponibles)
8. [Cómo Contribuir](#-cómo-contribuir)

---

## 📖 Introducción

**ZoneSport Backend** es la "parte servidor" del proyecto. Es donde ocurren cosas importantes:

- Valida que los usuarios sean reales (login/registro)
- Guarda eventos y partidos en la base de datos
- Calcula automáticamente las tablas de posiciones
- Envía emails de recuperación de contraseña
- Protege datos sensibles

**Está construido con NestJS** - un framework que hace fácil crear servidores seguros y organizados.

### Flujo Básico (Lo que sucede cuando un usuario hace algo)

```
1. Usuario hace clic en "Crear Evento" en el frontend
   ↓
2. Frontend envía petición HTTP POST a /events
   ↓
3. Backend recibe la petición en EventsController
   ↓
4. EventsController valida que el usuario esté autenticado
   ↓
5. EventsService guarda el evento en PostgreSQL
   ↓
6. Backend devuelve la respuesta al frontend con los datos del evento
   ↓
7. Frontend recibe datos y actualiza la página
```

---

## 🏗️ Estructura del Proyecto

```
server/
├── src/
│   ├── auth/                  # Autenticación y autorización
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/        # JWT Strategy
│   │   ├── guards/            # Guards para proteger rutas
│   │   ├── decorators/        # @CurrentUser, @Roles
│   │   └── dtos/              # Login, Register, Reset Password
│   │
│   ├── users/                 # Gestión de usuarios
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── user.entity.ts
│   │   └── dtos/
│   │
│   ├── events/                # Gestión de eventos/torneos
│   │   ├── events.service.ts
│   │   ├── events.controller.ts
│   │   ├── events.module.ts
│   │   ├── event.entity.ts
│   │   └── dtos/
│   │
│   ├── matches/               # Gestión de partidos
│   │   ├── matches.service.ts
│   │   ├── matches.controller.ts
│   │   ├── matches.module.ts
│   │   ├── match.entity.ts
│   │   └── dtos/
│   │
│   ├── sports/                # Catálogo de deportes
│   │   ├── sports.service.ts
│   │   ├── sports.controller.ts
│   │   ├── sports.module.ts
│   │   ├── sport.entity.ts
│   │   └── dtos/
│   │
│   ├── classifications/       # Tablas de clasificación
│   │   ├── classifications.service.ts
│   │   ├── classifications.controller.ts
│   │   ├── classifications.module.ts
│   │   ├── classification.entity.ts
│   │   └── dtos/
│   │
│   ├── news/                  # Blog y noticias
│   │   ├── news.service.ts
│   │   ├── news.controller.ts
│   │   ├── news.module.ts
│   │   ├── news.entity.ts
│   │   └── dtos/
│   │
│   ├── email/                 # Servicio de email (Resend)
│   │   ├── email.service.ts
│   │   └── email.module.ts
│   │
│   ├── app.module.ts          # Módulo raíz
│   ├── app.service.ts
│   ├── app.controller.ts
│   └── main.ts                # Punto de entrada
│
├── test/                      # Tests e2e
│   └── app.e2e-spec.ts
│
├── .env                       # Variables locales (NO commitar)
├── .env.example               # Template de variables
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 🧩 Módulos Principales

### 1. **Auth Module** - Autenticación

**¿Qué hace?**

- Registra nuevos usuarios (crea cuenta)
- Login (valida email + contraseña)
- Recuperación de contraseña (envía email con link)
- Crea tokens JWT (para peticiones futuras)

**Endpoints:**

```bash
POST   /auth/register              # Usuario nuevo
POST   /auth/login                 # Entrar a  cuenta
GET    /auth/profile               # Ver datos del usuario autenticado
POST   /auth/forgot-password       # Olvidó contraseña
POST   /auth/reset-password        # Cambiar contraseña con token
GET    /auth/validate-reset-token/:token  # Validar link de reset
```

**Flujo de Registro:**

```
1. Usuario llena formulario: email + contraseña
2. Backend valida que email no exista
3. Backend hashea contraseña (Bcrypt - irreversible)
4. Backend guarda en base de datos
5. Backend crea JWT (token de sesión)
6. Frontend recibe JWT y lo guarda en localStorage
7. Futuras peticiones incluyen ese JWT
```

**Flujo de Login:**

```
1. Usuario ingresa email + contraseña
2. Backend busca usuario por email
3. Backend compara contraseña (hasheada) con la ingresada
4. Si coincide → crea JWT y devuelve
5. Si no → error "usuario o contraseña incorrectos"
```

---

### 2. **Users Module** - Gestión de Usuarios

**¿Qué hace?**

- CRUD de usuarios (Create, Read, Update, Delete)
- Búsqueda de usuarios
- Gestión de roles (Atleta, Organizador, Admin)
- Actualización de perfil

**Endpoints:**

```bash
GET    /users                      # Listar todos los usuarios
GET    /users/:id                  # Obtener un usuario específico
GET    /users/search?email=abc     # Buscar por email
POST   /users                      # Crear usuario (admin)
PATCH  /users/:id                  # Actualizar usuario
DELETE /users/:id                  # Eliminar usuario
```

**Modelo User - Lo que se guarda:**

```typescript
{
  id: 1,                          // ID único
  email: "juan@example.com",      // Email único
  password: "$2b$10$...",          // Hasheado (no legible)
  firstName: "Juan",              
  lastName: "Pérez",
  phone: "+573001234567",
  role: "ATHLETE",                 // ATHLETE | ORGANIZER | ADMIN
  createdAt: "2026-02-12T10:30",  // Fecha de registro
  updatedAt: "2026-02-12T10:30"   // Última actualización
}
```

---

### 3. **Events Module** - Gestión de Eventos/Torneos

**¿Qué hace?**

- Crear eventos (torneos de fútbol, tenis, etc.)
- Listar eventos
- Ver detalles del evento
- Actualizar evento (solo organizador)
- Eliminar evento (solo organizador)
- Calcular automáticamente tablas de posiciones

**Endpoints:**

```bash
GET    /events                     # Ver todos los eventos
POST   /events                     # Crear evento
GET    /events/:id                 # Ver detalle del evento
PATCH  /events/:id                 # Editar evento
DELETE /events/:id                 # Eliminar evento
GET    /events/:id/classification  # Ver tabla de posiciones
```

**Modelo Event - Lo que se guarda:**

```typescript
{
  id: 1,
  name: "Torneo Futsal 2026",
  description: "Torneo de futsal barrial",
  sport: { id: 1, name: "Futsal" },           // Relación a Sport
  organizer: { id: 2, email: "oganizador..." },  // Usuario que crea
  startDate: "2026-03-01T10:00",
  endDate: "2026-03-15T18:00",
  status: "SCHEDULED",                         // SCHEDULED | IN_PROGRESS | FINISHED
  createdAt: "2026-02-12T10:30",
  updatedAt: "2026-02-12T10:30"
}
```

---

### 4. **Matches Module** - Partidos

**¿Qué hace?**

- Crear partidos dentro de un evento
- Registrar resultados (marcador)
- Listar partidos de un evento
- Actualizar clasificaciones automáticamente

**Endpoints:**

```bash
GET    /matches                    # Ver todos los partidos
POST   /matches                    # Crear partido
GET    /matches/:id                # Ver detalle
PATCH  /matches/:id                # Actualizar partido
DELETE /matches/:id                # Eliminar partido
POST   /matches/:id/result         # Registrar resultado (goles)
GET    /matches/event/:eventId     # Ver partidos del evento
```

**Modelo Match:**

```typescript
{
  id: 1,
  event: { id: 1 },                // A qué evento pertenece
  teamA: "Equipo Rojo",            // Primer equipo/jugador
  teamB: "Equipo Azul",            // Segundo equipo/jugador
  scoreA: 3,                       // Goles/puntos del equipo A
  scoreB: 2,                       // Goles/puntos del equipo B
  status: "PLAYED",                // PENDING | PLAYED | CANCELLED
  playedAt: "2026-03-05T15:30",   // Cuándo se jugó
  createdAt: "2026-02-12T10:30"
}
```

Cuando se registra un resultado (3-2), el sistema **automáticamente**:

- Suma puntos en la clasificación
- Actualiza racha de victorias/derrotas
- Reordena la tabla de posiciones

---

### 5. **Sports Module** - Catálogo de Deportes

**¿Qué hace?**

- Listar deportes disponibles (Fútbol, Tenis, Básquet, etc.)
- Admin puede agregar nuevos deportes

**Endpoints:**

```bash
GET    /sports                     # Ver deportes
POST   /sports                     # Crear deporte (admin)
GET    /sports/:id                 # Ver deporte
PATCH  /sports/:id                 # Actualizar (admin)
DELETE /sports/:id                 # Eliminar (admin)
```

**Ejemplo de Deporte:**

```typescript
{
  id: 1,
  name: "Futsal",                  # Nombre del deporte
  description: "Fútbol de salón"   # Qué es
}
```

---

### 6. **Classifications Module** - Tablas de Posiciones

**¿Qué hace?**

- Genera tabla de posiciones automáticamente
- Rankea equipos por victorias, puntos, diferencia
- Se actualiza cuando hay resultados

**Endpoints:**

```bash
GET    /classifications/event/:eventId  # Tabla del evento
POST   /classifications                 # Agregar equipo a tabla
DELETE /classifications/:id             # Eliminar de tabla
```

**Ejemplo de Fila en Tabla:**

```typescript
{
  position: 1,                   # Puesto (#1 primero)
  teamName: "Equipo Rojo",       # Nombre
  wins: 5,                       # Victorias
  losses: 1,                     # Derrotas
  draws: 1,                      # Empates
  points: 16,                    # Puntos totales (5*3 + 1*1 = 16)
  goalsFor: 23,                  # Goles a favor
  goalsAgainst: 8,               # Goles en contra
  goalDifference: 15             # Diferencia (23 - 8)
}
```

---

### 7. **News Module** - Blog de Noticias

**¿Qué hace?**

- Publicar noticias/artículos sobre eventos
- Listar noticias
- Solo admin/organizador puede publicar

**Endpoints:**

```bash
GET    /news                       # Ver noticias
POST   /news                       # Crear noticia (autenticado)
GET    /news/:id                   # Ver noticia
PATCH  /news/:id                   # Editar (autor/admin)
DELETE /news/:id                   # Eliminar (autor/admin)
```

---

### 8. **Email Module** - Servicio de Correo

**¿Qué hace?**

- Envía email de bienvenida al registrar
- Envía email de reset de contraseña
- Envía notificaciones generales

**NO es un endpoint REST** - Se usa internamente

Usa **Resend API** (alternativa moderna a SendGrid).

---

## 🌐 API REST

### Base URL

```
http://localhost:3001
```

### Documentación Interactiva (Swagger)

```
http://localhost:3001/api/docs
```

### Headers Comunes

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <tu_jwt_token>"
}
```

### Estructura de Respuesta

```json
{
  "statusCode": 200,
  "message": "Operación exitosa",
  "data": { /* datos */ }
}
```

### Códigos de Error

- `200` - OK
- `201` - Creado
- `400` - Bad Request (error de validación)
- `401` - Unauthorized (sin token o token inválido)
- `403` - Forbidden (no autorizado)
- `404` - Not Found (recurso no existe)
- `500` - Server Error

---

## 🔐 Autenticación JWT

### ¿Qué es JWT?

JWT (JSON Web Token) es un token que se envía en las cabeceras para identificar al usuario sin necesidad de sesiones.

### Estructura del JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Tiene 3 partes separadas por punto (`.`):

1. **Header** - Algoritmo y tipo
2. **Payload** - Datos del usuario
3. **Signature** - Firma de seguridad

### Flujo de Autenticación

```
1. Usuario se registra/login
   ↓
2. Backend valida credenciales
   ↓
3. Backend genera JWT firmado con JWT_SECRET
   ↓
4. Cliente recibe el token
   ↓
5. Cliente envía token en headers: Authorization: Bearer <token>
   ↓
6. Backend valida y desencripta el token
   ↓
7. Si es válido, procesa la petición
```

### Variables de Entorno

```env
JWT_SECRET=<cadena-aleatoria-de-32-caracteres>        # Para firmar tokens
JWT_EXPIRATION=3600                                     # Expiración en segundos
JWT_RESET_SECRET=<otra-cadena-aleatoria-de-32-chars>  # Para reset password
```

### Como usar JWT en requests

**En Swagger (herramienta interactiva):**

1. Haz login para obtener el token
2. Copia el `accessToken` de la respuesta
3. Haz clic en el botón verde **"Authorize"**
4. Pega el token
5. Ya puedes usar endpoints protegidos

**Con cURL:**

```bash
curl -H "Authorization: Bearer <tu_token>" \
     http://localhost:3001/users
```

---

## 💾 Base de Datos

### Configuración

**Driver:** PostgreSQL 16  
**ORM:** TypeORM  
**Migraciones:** TypeORM Migrations

### Variables de Entorno

```env
DB_HOST=localhost          # o 'postgres' si usas Docker
DB_PORT=5432
DB_USERNAME=zonesport_user
DB_PASSWORD=<tu-contraseña>
DB_NAME=zonesport_db
```

### Tablas Principales

1. **user** - Usuarios del sistema
2. **sport** - Deportes
3. **event** - Eventos/torneos
4. **match** - Partidos
5. **classification** - Clasificaciones
6. **news** - Noticias
7. **password_reset_token** - Tokens para reset

### Relaciones

```
User
  ├─ 1:N → Event (organizador)
  └─ N:M → Match (participante)

Event
  ├─ N:1 → Sport
  ├─ N:1 → User (organizador)
  ├─ 1:N → Match
  └─ 1:N → Classification

Match
  └─ N:1 → Event

Classification
  ├─ N:1 → Event
  └─ N:1 → User
```

---

## 🚀 Comandos Disponibles

### Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (watch)
npm run start:dev

# Ejecutar en modo debug
npm run start:debug

# Compilar para producción
npm run build

# Ejecutar versión compilada
npm start
```

### Testing

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests e2e (end-to-end)
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

### Linting

```bash
# Verificar código con ESLint
npm run lint

# Arreglar problemas automáticamente
npm run lint:fix
```

---

## 🔨 Cómo Contribuir

### Crear un Nuevo Módulo

1. **Generar estructura con NestJS CLI:**

```bash
nest generate module newfeature
nest generate controller newfeature
nest generate service newfeature
---

## 🗂️ Estructura del Backend (Detallada)

```

server/
├── src/
│   ├── main.ts                  → Entry point (puerto 3001)
│   ├── app.module.ts            → Configuración principal
│   ├── app.controller.ts        → Health check
│   ├── app.service.ts           → Lógica base
│   │
│   ├── auth/
│   │   ├── auth.controller.ts   → Endpoints: login, register, forgot-password
│   │   ├── auth.service.ts      → JWT, bcrypt, tokens
│   │   ├── auth.module.ts
│   │   ├── auth.guard.ts        → Protege rutas autenticadas
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── dtos/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── forgot-password.dto.ts
│   │   ├── entities/
│   │   │   └── password-reset-token.entity.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   │
│   ├── users/
│   │   ├── user.entity.ts       → User { id, email, password, role, ... }
│   │   ├── users.controller.ts  → GET /users, GET /users/:id
│   │   ├── users.service.ts     → CRUD de usuarios
│   │   └── users.module.ts
│   │
│   ├── sports/
│   │   ├── sport.entity.ts      → Sport { id, name, rules, ... }
│   │   ├── sports.controller.ts → CRUD de deportes
│   │   ├── sports.service.ts
│   │   ├── sports.module.ts
│   │   └── dtos/
│   │
│   ├── events/
│   │   ├── event.entity.ts      → Event { id, name, status, organizer, sport, ... }
│   │   ├── events.controller.ts → POST, GET, PATCH /events
│   │   ├── events.service.ts    → Lógica de eventos
│   │   ├── events.module.ts
│   │   └── dtos/
│   │
│   ├── matches/
│   │   ├── match.entity.ts      → Match { id, teamA, teamB, score, status, ... }
│   │   ├── matches.controller.ts
│   │   ├── matches.service.ts      → Actualizar scores → recalcula clasificación
│   │   ├── matches.module.ts
│   │   └── dtos/
│   │
│   ├── classifications/
│   │   ├── classification.entity.ts  → Classification { teamName, points, wins, ... }
│   │   ├── classifications.controller.ts  → GET /classifications
│   │   ├── classifications.service.ts     → Cálculo automático de posiciones
│   │   └── classifications.module.ts
│   │
│   ├── news/
│   │   ├── news.entity.ts       → News { id, title, content, author, ... }
│   │   ├── news.controller.ts   → CRUD de noticias
│   │   ├── news.service.ts
│   │   ├── news.module.ts
│   │   └── dtos/
│   │
│   └── email/
│       ├── email.service.ts     → Envío de emails (Resend)
│       └── email.module.ts
│
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── nest-cli.json

```

---

## 📊 Modelos de Datos (Relaciones)

```

┌──────────────────────────────────────┐
│ User (Usuarios)                      │
├──────────────────────────────────────┤
│ id (PK)                              │
│ email (unique)                       │
│ password (bcrypted)                  │
│ firstName, lastName                  │
│ phone?                               │
│ role (ATHLETE | ORGANIZER | ADMIN)  │
│ createdAt, updatedAt                 │
└──────────────────────────────────────┘
         ↓ organizedEvents

┌──────────────────────────────────────┐
│ Event (Eventos/Torneos)              │
├──────────────────────────────────────┤
│ id (PK)                              │
│ name                                 │
│ description?                         │
│ status (SCHEDULED|IN_PROGRESS|FINISHED)
│ startDate, endDate?                  │
│ organizerId (FK: User)               │
│ sportId (FK: Sport)                  │
│ createdAt, updatedAt                 │
└──────────────────────────────────────┘
     ↓ matches          ↓ classifications

┌──────────────────┐    ┌─────────────────────────┐
│ Match (Partidos) │    │ Classification (Tabla)  │
├──────────────────┤    ├─────────────────────────┤
│ id (PK)          │    │ id (PK)                 │
│ teamA, teamB     │    │ teamName                │
│ scoreA?, scoreB? │    │ points (total)          │
│ status           │    │ wins, draws, losses     │
│ scheduledDate    │    │ goalsFor/Against        │
│ eventId (FK)     │    │ position (ranking)      │
└──────────────────┘    │ eventId (FK)            │
                        └─────────────────────────┘

┌──────────────────────────────────────┐
│ Sport (Deportes)                     │
├──────────────────────────────────────┤
│ id (PK)                              │
│ name (unique)                        │
│ description?                         │
│ classificationRules (JSON)           │
│   - pointsForWin: 3                  │
│   - pointsForDraw: 1                 │
│   - pointsForLoss: 0                 │
└──────────────────────────────────────┘

┌────────────────────────────────────┐
│ News (Noticias/Blog)               │
├────────────────────────────────────┤
│ id (PK)                            │
│ title                              │
│ content                            │
│ summary?                           │
│ imageUrl?                          │
│ authorId (FK: User)                │
│ createdAt, updatedAt               │
└────────────────────────────────────┘

┌──────────────────────────────────────┐
│ PasswordResetToken (Tokens)          │
├──────────────────────────────────────┤
│ id (PK)                              │
│ token (unique)                       │
│ userId (FK: User)                    │
│ expires (expiresAt)                  │
└──────────────────────────────────────┘

```

---

## 🔗 Endpoints Principales (API REST)

### Autenticación
```

POST   /auth/register           → Crear cuenta { email, password, firstName, lastName }
POST   /auth/login              → Login { email, password } → { accessToken }
POST   /auth/forgot-password    → Solicitar reset { email } → envía email
POST   /auth/reset-password     → Cambiar contraseña { token, newPassword }

```

### Usuarios
```

GET    /users                   → Listar usuarios
GET    /users/:id               → Obtener usuario
GET    /users/me                → Perfil actual
PATCH  /users/:id               → Actualizar usuario
DELETE /users/:id               → Eliminar usuario
SEARCH /users/search?q=...      → Buscar usuarios

```

### Deportes
```

GET    /sports                  → Listar deportes
GET    /sports/:id              → Obtener deporte
POST   /sports                  → Crear deporte (ADMIN)
PATCH  /sports/:id              → Actualizar deporte (ADMIN)
DELETE /sports/:id              → Eliminar deporte (ADMIN)

```

### Eventos
```

GET    /events                  → Listar eventos
GET    /events/:id              → Obtener evento + matches + clasificación
POST   /events                  → Crear evento (ORGANIZER+)
PATCH  /events/:id              → Actualizar evento
DELETE /events/:id              → Eliminar evento

```

### Partidos
```

GET    /matches                 → Listar partidos
GET    /matches/:id             → Obtener partido
POST   /matches                 → Crear partido { teamA, teamB, scheduledDate, eventId }
PATCH  /matches/:id             → Actualizar resultado { scoreA, scoreB, status }
        → Trigger: recalcula clasificación automáticamente
DELETE /matches/:id             → Eliminar partido

```

### Clasificaciones
```

GET    /classifications?eventId=... → Obtener tabla de posiciones (ordenada por puntos)

```

### Noticias
```

GET    /news                    → Listar noticias
GET    /news/:id                → Obtener noticia
POST   /news                    → Crear noticia { title, content, imageUrl? }
PATCH  /news/:id                → Actualizar noticia
DELETE /news/:id                → Eliminar noticia

```

---

## 🔐 Seguridad & Roles

### Roles de Usuario
```typescript
enum UserRole {
  ATHLETE = 'ATHLETE',        // Usuario normal
  ORGANIZER = 'ORGANIZER',    // Puede crear eventos
  ADMIN = 'ADMIN',            // Acceso total (gestión)
}
```

### Protección de Rutas

```typescript
// Guards automáticos
@UseGuards(JwtAuthGuard)       // Requiere autenticación
@Roles(UserRole.ADMIN)         // Requiere rol ADMIN
```

**Ejemplo:**

```typescript
@Post('/sports')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN)
createSport(@Body() dto: CreateSportDto) {
  // Solo ADMIN puede crear deportes
}
```

---

## 🔄 Flujos Importantes

### 1️⃣ Crear Evento

```
Frontend POST /events
  ↓
EventsController valida token + rol
  ↓
EventsService crea en DB
  ↓
Retorna: { id, name, sport, status, matches: [], classifications: [] }
```

### 2️⃣ Actualizar Resultado de Partido

```
Frontend PATCH /matches/:id { scoreA: 2, scoreB: 1 }
  ↓
MatchesController valida
  ↓
MatchesService actualiza partido
  ↓
ClassificationsService recalcula tabla automáticamente
  → Suma puntos (3 pts = victoria, 1 = empate, 0 = derrota)
  → Actualiza golesFor/Against
  → Reordena posiciones
  ↓
Retorna: partido actualizado + clasificación nueva
```

### 3️⃣ Solicitar Reset de Contraseña

```
Frontend POST /auth/forgot-password { email }
  ↓
AuthService genera token temporal (1 hora)
  ↓
EmailService envía email con link:
  https://zonesport.vercel.app/reset-password/[token]
  ↓
Usuario recibe email, hace clic
  ↓
Frontend POST /auth/reset-password { token, newPassword }
  ↓
Backend valida token, actualiza password con bcrypt
```

---

## 🔧 Variables de Entorno Necesarias

Ver [.env.example](/.env.example) en la raíz.

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=miki_user
DB_PASSWORD=7667
DB_NAME=zonesport_db

# JWT
JWT_SECRET=your_very_long_jwt_secret_minimum_32_chars
JWT_RESET_SECRET=your_very_long_reset_secret_minimum_32_chars
JWT_EXPIRATION=24h

# Server
NODE_ENV=development
PORT=3001

# Frontend
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Frontend public
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🧪 Testing de Endpoints

### Con cURL

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Obtener eventos (con token)
curl http://localhost:3001/events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Crear evento
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Torneo Futbol 2026",
    "sportId": 1,
    "startDate": "2026-03-01T10:00:00Z"
  }'
```

### Con Postman o Insomnia

1. Importar: [Server URL]/api/docs (Swagger)
2. Hacer requests desde UI
3. Automáticamente incluye Bearer token

### Con curl desde la terminal

```bash
# Acceder a docs Swagger
open http://localhost:3001/api/docs
```

---

## 📚 Recursos Útiles

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
- [TypeORM Documentation](https://typeorm.io/)
- [TypeORM Relations](https://typeorm.io/relations)
- [JWT Authentication](https://docs.nestjs.com/security/authentication)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Swagger/OpenAPI en NestJS](https://docs.nestjs.com/openapi/introduction)

---

**Última actualización**: 15 de Febrero de 2026  
**Versión**: 2.0.0  
**Mantenedor**: Miguel Estrada López
