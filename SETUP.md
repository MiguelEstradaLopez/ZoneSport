# 🚀 Setup Completo - ZoneSport

Guía completa para clonar, configurar, iniciar el proyecto localmente, incluyendo seguridad y variables de entorno.

---

## 📋 Tabla de Contenidos

1. [Inicio Rápido (5 minutos)](#-inicio-rápido)
2. [Requisitos](#-requisitos)
3. [Instalación Detallada](#-instalación-detallada)
4. [Variables de Entorno](#-variables-de-entorno)
5. [Base de Datos](#-base-de-datos)
6. [Medidas de Seguridad](#-medidas-de-seguridad)
7. [Desarrollo Local](#-desarrollo-local)
8. [Troubleshooting](#-troubleshooting)

---

## ⚡ Inicio Rápido (5 minutos)

**Para desarrolladores que saben qué hacer:**

```bash
# 1. Clonar
git clone https://github.com/MiguelEstradaLopez/ZoneSport.git && cd ZoneSport

# 2. Base de datos
docker-compose up -d

# 3. Backend (Terminal 1)
cd server && npm install
cp .env.example .env      # Editar solo si es necesario para desarrollo
npm run dev             # http://localhost:3001

# 4. Frontend (Terminal 2)
cd client && npm install && npm run dev  # http://localhost:3000
```

**Que esperas:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001  
- API Docs: http://localhost:3001/api/docs
- Database: Postgres en localhost:5432

---

## 📋 Requisitos Previos

### Software Necesario

| Software | Versión Mínima | Instalación |
|----------|----------------|-------------|
| **Node.js** | v18.0 | https://nodejs.org |
| **npm** | v9.0 | Incluido con Node.js |
| **Git** | v2.30 | https://git-scm.com |
| **Docker** | v20.0 | https://docker.com |
| **Docker Compose** | v1.29 | Incluido con Docker Desktop |

### Verificar que todo está instalado

```bash
node --version        # Debería mostrar v18.x.x o superior
npm --version         # Debería mostrar 9.x.x o superior
git --version         # Debería mostrar 2.x.x o superior
docker --version      # Debería mostrar 20.x.x o superior
docker-compose version  # Debería mostrar 1.x.x o superior
```

Si alguno falta, instálalo usando los links de arriba.

---

## 🔧 Instalación Paso a Paso Completa

### Paso 1: Clonar el Repositorio

```bash
# Opción A: Clonar con HTTPS (recomendado para principiantes)
git clone https://github.com/MiguelEstradaLopez/ZoneSport.git
cd ZoneSport

# Opción B: Clonar con SSH (si tienes configurada GitHub SSH)
git clone git@github.com:MiguelEstradaLopez/ZoneSport.git
cd ZoneSport

# Verificar que estamos en la carpeta correcta
ls -la
# Deberías ver: server/, client/, docker-compose.yml, README.md, etc.
```

### Paso 2: Iniciar la Base de Datos

#### Opción A: Con Docker (RECOMENDADO - Más fácil)

```bash
# Desde la raíz del proyecto, ejecuta:
docker-compose up -d

# Verificar que está corriendo correcto
docker-compose ps
# Deberías ver: zonesport_db con status "Up"

# Si necesitas ver los logs
docker-compose logs -f postgres

# Para detener cuando termines (pero mantiene los datos)
docker-compose stop

# Para eliminar todo (incluyendo datos)
docker-compose down -v
```

**¿Por qué Docker es mejor?**
- No necesitas instalar PostgreSQL manualmente
- Todo en 1 comando
- Igual en todos los equipos (Windows, Mac, Linux)
- Fácil de resetear

#### Opción B: PostgreSQL Local (Si NO quieres Docker)

```bash
# 1. Descargar e instalar PostgreSQL desde:
# https://www.postgresql.org/download/

# 2. Abrir terminal y conectar como usuario admin
psql -U postgres
# Te pedirá la contraseña que pusiste en la instalación

# 3. Dentro de psql, crear usuario y base de datos
CREATE USER zonesport_user WITH PASSWORD 'desarrollo123';
CREATE DATABASE zonesport_db OWNER zonesport_user;
GRANT ALL PRIVILEGES ON DATABASE zonesport_db TO zonesport_user;

# 4. Salir de psql
\q

# 5. Verificar que funciona
psql -U zonesport_user -d zonesport_db
# Si te conecta sin error, está bien
```

### Paso 3: Configurar Backend

```bash
# 1. Entrar a carpeta del servidor
cd server

# 2. Copiar template de variables de entorno
cp .env.example .env

# 3. Editar el archivo .env
# En Windows:
notepad .env
# En Mac/Linux:
nano .env

# Cambiar SOLO estas 2 líneas si usas PostgreSQL local:
DB_HOST=localhost          # Cambiar "postgres" por "localhost"
DB_PORT=5432

# Si usas Docker, dejar como está

# 4. Guardar (Ctrl+S en Windows, Ctrl+X entonces Y en nano)

# 5. Instalar dependencias 
npm install
# Esto descarga todas las librerías necesarias

# 6. Iniciar servidor en modo desarrollo
npm run dev
# Deberías ver: "✅ Backend corriendo en http://localhost:3001"
# Si hay error, revisa troubleshooting abajo
```

### Paso 4: Configurar Frontend

**En otra terminal (NO cierres la del backend):**

```bash
# 1. Entrar a carpeta del cliente
cd client

# 2. Instalar dependencias
npm install

# 3. Iniciar frontend en modo desarrollo
npm run dev
# Deberías ver: "Local: http://localhost:3000"

# Abre http://localhost:3000 en tu navegador
# ¡Ya deberías ver la página!
```

---

## 🔐 Variables de Entorno (.env)

### Para Backend (/server/.env)

Después de hacer `cp .env.example .env`, tu archivo debería verse así:

```env
# ==================== CONFIGURACIÓN DE SASE DE DATOS ====================
DB_HOST=postgres                          # "postgres" con Docker, "localhost" sin
DB_PORT=5432
DB_USERNAME=zonesport_user                # Usuario de PostgreSQL
DB_PASSWORD=desarrollo123                 # Contraseña (para desarrollo, puede ser simple)
DB_NAME=zonesport_db                      # Nombre de la base de datos
NODE_ENV=development

# ==================== SEGURIDAD - JWT (⚠️ CAMBIAR SI SUBES A PRODUCCIÓN) ====================
JWT_SECRET=your-super-secret-key-here-change-in-production
JWT_EXPIRATION=3600                       # Tiempo en segundos (3600 = 1 hora)
JWT_RESET_SECRET=your-reset-secret-here-change-in-production
JWT_RESET_EXPIRATION=86400                # 24 horas

# ==================== EMAIL (Resend API) ====================
RESEND_API_KEY=re_                        # Dejar en blanco si no tienes API key (emails no funcionarán)
RESEND_FROM_EMAIL=noreply@zonesport.com  

# ==================== SERVIDOR ====================
PORT=3001                                 # Puerto donde corre
FRONTEND_URL=http://localhost:3000        # URL del frontend
CORS_ORIGIN=http://localhost:3000         # De dónde acepta peticiones
```

### Para Frontend (/client NO hay .env)

El frontend en desarrollo NO necesita archivo `.env` (usa localhost por defecto).

Si quieres cambiar el URL del backend en desarrollo:

```bash
# Opción A: Variable de entorno en terminal (temporal)
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev

# Opción B: Crear .env.local (persistente, NO commitear)
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
npm run dev
```

---

## 🔒 Generación de Claves JWT Seguras

**Para desarrollo:** Puedes usar valores por defecto.  
**Para producción:** DEBES generar claves aleatorias.

Generar claves seguras (en cualquier terminal):

```bash
# En Windows (PowerShell)
$GUID = [guid]::NewGuid().ToString().Replace("-","")
$GUID

# En Mac/Linux
openssl rand -hex 32
# Ejemplo output: f2c4e8a1b9d7e3f5a2c8e4b1d9f7a3c5e2b8d4a9f1c7e5b3a1d9f7e4b2c6a8

# Copiar esa salida y pegarla en .env como:
JWT_SECRET=f2c4e8a1b9d7e3f5a2c8e4b1d9f7a3c5e2b8d4a9f1c7e5b3a1d9f7e4b2c6a8
```

---

## 💾 Base de Datos

### Estructura Automática

Cuando el backend inicia, **crea automáticamente** todas las tablas gracias a TypeORM.

**Tablas que se crean:**

1. **users** - Usuarios del sistema
2. **sports** - Deportes disponibles
3. **events** - Eventos/torneos
4. **matches** - Partidos dentro de eventos
5. **classifications** - Tablas de posiciones
6. **news** - Noticias/blog
7. **password_reset_tokens** - Tokens de reset

### Si necesitas resetear la BD

```bash
# Opción A: Con Docker (más fácil)
docker-compose down -v  # Elimina todo incluido datos
docker-compose up -d    # Crea de nuevo

# Opción B: Manual en PostgreSQL
psql -U postgres
DROP DATABASE zonesport_db;
CREATE DATABASE zonesport_db OWNER zonesport_user;
\q
```

---

## 🔒 Medidas de Seguridad

### 1. Mantén .env en SECRETO

```bash
# ✅ CORRECTO - .env está en .gitignore (no se commitea)
git status
# No debería aparecer .env en la lista

# ❌ INCORRECTO - Cometer secrets
git add .env         # NO HAGAS ESTO
git commit -m "added env"  # NUNCA
```

### 2. Credenciales Fuertes

```env
# ❌ MAL - Demasiado simple
DB_PASSWORD=password
DB_PASSWORD=123456

# ✅ BIEN - Complejo (+12 caracteres, mixto, números, símbolos)
DB_PASSWORD=Zs#2026AntMiX$9aPqRs!7eTuVw
```

### 3. JWT Secrets

```env
# ❌ MAL - Por defecto visible
JWT_SECRET=your-secret-key-here

# ✅ BIEN - Generado aleatoriamente (32 caracteres)
JWT_SECRET=f2c4e8a1b9d7e3f5a2c8e4b1d9f7a3c5e2b8d4a9f1c7e5b3a1d9f7e4b2c6a8
```

### Checklist de Seguridad ✓

- [ ] `.env` está en `.gitignore`
- [ ] JWT_SECRET es diferente del JWT_RESET_SECRET
- [ ] DB_PASSWORD tiene +12 caracteres y es complejo
- [ ] Node ENV es `development` localmente
- [ ] CORS_ORIGIN es solo `localhost:3000`
- [ ] No hay `console.log` de datos sensibles en código
- [ ] Nunca hiciste `git push` de un archivo `.env`

---

## 💻 Comandos de Desarrollo (Useful)

---

## 💾 Base de Datos

### Estructura

La base de datos se crea automáticamente al iniciar el backend (TypeORM auto-sync).

**Tablas principales:**

1. `user` - Usuarios del sistema
2. `sport` - Catálogo de deportes
3. `event` - Eventos/torneos
4. `match` - Partidos
5. `classification` - Tablas de posiciones
6. `password_reset_token` - Tokens para reset (expiración)

### Reset de Base de Datos

Si necesitas limpiar y crear de nuevo:

```bash
# Con Docker
docker-compose down -v              # Elimina volumen de datos

# Luego reiniciar
docker-compose up -d

# Alternativa: Manual en psql
psql -U postgres
DROP DATABASE zonesport_db;
CREATE DATABASE zonesport_db OWNER zonesport_user;
\q
```

---

## 🔒 Medidas de Seguridad

### 1. Protección de Variables Sensibles

**❌ NO HAGAS:**
```bash
# ❌ Los commit NUNCA deben incluir .env
git add .env              # NUNCA
git commit -m "agregando secretos"  # NUNCA
```

**✅ CORRECTO:**
```bash
# .env NUNCA se commitea (incluido en .gitignore)
# Solo .env.example se commitea (sin valores reales)
git add .env.example      # SÍ
git add .env              # NO
```

### 2. Credenciales de Base de Datos

```env
# ❌ MAL - Password débil
DB_PASSWORD=password
DB_PASSWORD=123456

# ✅ BIEN - Password fuerte
DB_PASSWORD=Zs#2026AntMiX$9aPqRs!7eTuVw
```

### 3. Tokens JWT

```env
# ❌ MAL - Por defecto (visible en el código)
JWT_SECRET=your-secret-key-here

# ✅ BIEN - Generado aleatoriamente
JWT_SECRET=f2c4e8a1b9d7e3f5a2c8e4b1d9f7a3c5e2b8d4a9f1c7e5b3a1d9f7e4b2c6a8
```

### 4. Checklist de Seguridad

- [ ] `.env` está en `.gitignore` (verificar)
- [ ] Todos los JWT_SECRET son diferentes
- [ ] DB_PASSWORD es fuerte (min 12 caracteres, mayúscula, números, símbolos)
- [ ] RESEND_API_KEY no es visible en logs
- [ ] CORS_ORIGIN solo contiene localhost en desarrollo
- [ ] NODE_ENV=development en local, production en deploy
- [ ] No hay console.log de datos sensibles
- [ ] Contraseñas hasheadas con bcrypt (10 rounds)

---

## 💻 Desarrollo Local

### Comandos Backend

```bash
cd server

npm run dev              # Modo desarrollo (watch)
npm run build           # Compilar
npm start               # Ejecutar compilado
npm run start:debug     # Debug
npm test                # Tests unitarios
npm run test:e2e        # Tests end-to-end
```

### Comandos Frontend

```bash
cd client

npm run dev             #
 Desarrollo (http://localhost:3000)
npm run build           # Build para producción
npm start               # Ejecutar build
npm run lint            # Linting
```

### API Documentation

```
http://localhost:3001/api/docs
```

Ofrece interfaz interactiva (Swagger) para probar todos los endpoints.

**Cómo usar:**

1. Haz login para obtener JWT token
2. Copia el token
3. Haz click en "Authorize" (botón verde)
4. Pega el token y autoriza
5. Ahora puedes probar endpoints protegidos

### Desarrollo Recomendado

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev

# Terminal 3 - Monitorear logs
docker-compose logs -f postgres
```

---

## 🆘 Troubleshooting

### Error: `npm: command not found`

```bash
# Instala Node.js desde https://nodejs.org/
# Verifica instalación
node --version
npm --version
```

### Error: `docker-compose: command not found`

```bash
# Instala Docker Desktop desde https://docker.com/
# o via paquete
brew install docker-compose  # macOS
sudo apt install docker-compose  # Linux
```

### Error: `Cannot connect to database`

```bash
# 1. Verificar Docker está corriendo
docker ps

# 2. Verificar servicios
docker-compose ps

# 3. Iniciar si está down
docker-compose up -d

# 4. Ver logs
docker-compose logs postgres

# 5. Revisar .env
cat server/.env | grep DB_
```

### Error: `JWT_SECRET is required`

```bash
# 1. Verificar .env existe
ls server/.env

# 2. Verificar variables están definidas
grep "JWT_SECRET" server/.env

# 3. Generar si falta
echo "JWT_SECRET=$(openssl rand -hex 32)" >> server/.env
```

### Error: `Port 3000/3001 already in use`

```bash
# Ver qué proceso usa el puerto
lsof -i :3001      # Backend
lsof -i :3000      # Frontend

# Matar proceso
kill -9 <PID>

# O usar diferente puerto
PORT=3002 npm run dev
```

### Error: `ECONNREFUSED` (Backend no conecta a Frontend)

```bash
# 1. Verificar backend está corriendo
curl http://localhost:3001/health

# 2. Verificar CORS en backend
grep "CORS_ORIGIN" server/.env

# 3. Verificar API URL en frontend
grep "NEXT_PUBLIC_API_URL" client/.env.local

# 4. Limpiar caché browser (Ctrl+Shift+Delete)
```

### Error: `node_modules` corrupto

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Checklist de Setup Completo

- [ ] Node.js v18+ instalado
- [ ] Docker instalado (opcional pero recomendado)
- [ ] Repositorio clonado
- [ ] Docker services corriendo (`docker-compose up -d`)
- [ ] Backend `.env` configurado con valores reales
- [ ] Frontend `.env.local` configurado
- [ ] `npm install` ejecutado en server y client
- [ ] Backend iniciado (`npm run dev`)
- [ ] Frontend iniciado (`npm run dev`)
- [ ] Frontend accesible en http://localhost:3000
- [ ] Backend accesible en http://localhost:3001
- [ ] API Swagger funciona en http://localhost:3001/api/docs
- [ ] Prueba de registro/login funciona
- [ ] Email configurado (si necesitas)
- [ ] `.env` NO está en git (verificar `.gitignore`)
- [ ] Todos los JWT_SECRET son únicos y seguros

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)

### Herramientas Útiles

- [Resend API](https://resend.com) - Email
- [DBeaver](https://dbeaver.io/) - GUI para PostgreSQL
- [Insomnia](https://insomnia.rest/) - API Testing
- [VS Code](https://code.visualstudio.com/) - Editor

---

**Última actualización**: 12 de Febrero de 2026  
**Versión**: 1.0.0

---

## 🚀 Inicio Rápido

### Setup en 5 Minutos

```bash
# 1. Clonar repositorio
git clone https://github.com/MiguelEstradaLopez/ZoneSport.git
cd ZoneSport

# 2. Iniciar Base de Datos (Docker)
docker-compose up -d

# 3. Backend (Terminal 1)
cd server
cp .env.example .env          # IMPORTANTE: Editar con valores locales
npm install
npm run dev                   # Arranca en http://localhost:3001

# 4. Frontend (Terminal 2)
cd client
npm install
npm run dev                   # Arranca en http://localhost:3000
```

### URLs de Acceso

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>
- **API Swagger UI**: <http://localhost:3001/api/docs> ← Documentación interactiva
- **Base de Datos**: localhost:5432

---

## ⚙️ Configuración Inicial

### Paso 1: Variables de Entorno (.env)

```bash
cd server
cp .env.example .env
nano .env  # Editar valores
```

**Variables críticas a configurar**:

```env
# Database
DB_HOST=postgres              # (si usas Docker) o localhost
DB_PORT=5432
DB_USERNAME=zonesport_user
DB_PASSWORD=<tu-contraseña>
DB_NAME=zonesport_db

# JWT
JWT_SECRET=<generar-con-openssl>
JWT_RESET_SECRET=<generar-diferente>

# Email (Resend)
RESEND_API_KEY=<tu-clave-api>
RESEND_FROM_EMAIL=noreply@zonesport.com

# Server
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

**Generar claves JWT**:

```bash
openssl rand -hex 32  # Para JWT_SECRET
openssl rand -hex 32  # Para JWT_RESET_SECRET
```

Ver la sección [🔒 Medidas de Seguridad](#-medidas-de-seguridad) en este documento para detalles completos.

### Paso 2: Base de Datos

**Con Docker (Recomendado)**:

```bash
docker-compose up -d
# Crea automáticamente usuario y base de datos
```

**Manual (PostgreSQL local)**:

```bash
psql -U postgres
CREATE USER zonesport_user WITH PASSWORD 'tu-contraseña';
CREATE DATABASE zonesport_db OWNER zonesport_user;
\q
```

### Paso 3: Instalar Dependencias

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

## 📁 Estructura del Proyecto

### Carpetas Principales

```
ZoneSport/
├── server/                        # Backend NestJS
│   ├── src/
│   │   ├── auth/                 # Autenticación JWT
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── strategies/       # JWT Strategy
│   │   │   ├── guards/           # JWT Guard
│   │   │   └── decorators/       # @CurrentUser, @Roles
│   │   ├── users/                # Gestión de usuarios
│   │   ├── events/               # Torneos y eventos
│   │   ├── matches/              # Partidos
│   │   ├── sports/               # Catálogo de deportes
│   │   ├── classifications/      # Tablas de posiciones
│   │   ├── news/                 # Blog y noticias
│   │   ├── email/                # Servicio de email (Resend)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                      # Variables locales (NO commitar)
│   ├── .env.example              # Template
│   └── package.json
│
├── client/                        # Frontend Next.js
│   ├── app/
│   │   ├── page.tsx              # Home
│   │   ├── login/
│   │   ├── registrar/
│   │   ├── reset-password/
│   │   └── noticias/
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.tsx
│   ├── services/
│   │   └── api.ts                # Cliente HTTP
│   └── package.json
│
├── docker-compose.yml            # Configuración Docker
├── SETUP.md                      # Configuración, seguridad e inicialización (este archivo)
├── SETUP.md                      # Este archivo
└── README.md                     # Información del proyecto
```

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS, TypeScript |
| **Backend** | NestJS 11, TypeORM, PostgreSQL 16 |
| **Autenticación** | JWT + Bcrypt |
| **Email** | Resend API |
| **Database** | PostgreSQL 16 (Docker) |

---

## 💻 Desarrollo

### Comandos Principales

**Backend**:

```bash
cd server

npm run dev              # Modo desarrollo (watch mode)
npm run build           # Compilar para producción
npm run start           # Iniciar versión compilada
npm run start:debug     # Modo debug
npm test                # Ejecutar tests
```

**Frontend**:

```bash
cd client

npm run dev             # Modo desarrollo
npm run build           # Compilar para producción
npm run lint            # Lint del código
npm run format          # Formatear código
```

### Estructura de Código

#### Backend (NestJS)

**Módulos**:

- Cada feature (auth, users, events) tiene su propia carpeta
- Estructura: controller, service, entity, dto, module

**Ejemplo - Auth**:

```typescript
// auth.controller.ts - Maneja rutas HTTP
@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() dto: RegisterDto) { }
  
  @Post('login')
  login(@Body() dto: LoginDto) { }
}

// auth.service.ts - Lógica de negocio
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  
  async register(dto: RegisterDto) { }
  async login(dto: LoginDto) { }
}

// auth.module.ts - Agrupa componentes
@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

#### Frontend (Next.js)

**App Router**:

```
app/
├── page.tsx           # / (home)
├── login/
│   └── page.tsx       # /login
├── registrar/
│   └── page.tsx       # /registrar
└── reset-password/
    └── [token]/page.tsx  # /reset-password/:token
```

**Cliente API** (`services/api.ts`):

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authAPI = {
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_URL}/auth/login`, data),
};
```

---

## 🧪 Testing

### Test 1: Registro y Login

1. **Ir a registro**: <http://localhost:3000/registrar>
2. **Llenar formulario**:
   - Email: `test@zonesport.com`
   - Contraseña: `TestPass123!`
   - Nombre: `Juan`
   - Apellido: `García`
3. **Verificar backend**: Deberías ver logs de registro
4. **Ir a login**: <http://localhost:3000/login>
5. **Ingresar credenciales**: Email y contraseña
6. **Verificar token**: El token debe guardarse en localStorage

### Test 2: Recuperación de Contraseña

1. **Ir a login**: <http://localhost:3000/login>
2. **Click "¿Olvidaste tu contraseña?"**
3. **Ingresar email**: `test@zonesport.com`
4. **Revisar logs**: Backend debe crear token reset
5. **Simular email**: Token sale en logs (modo desarrollo)
6. **Ir a reset**: `http://localhost:3000/reset-password/{token}`
7. **Cambiar contraseña**: Nueva contraseña

### Test 3: Crear Evento

1. **Login** como usuario
2. **Ir a eventos**
3. **Crear evento**: Llenar formulario
4. **Verificar**: Evento aparece en lista

### Test 4: Email (Resend)

```bash
# 1. Revisar que RESEND_API_KEY esté en .env
grep "RESEND_API_KEY" server/.env

# 2. Trigger un email (reset de password)
# Backend debe conectarse a Resend sin errores

# 3. Revisar logs
# Deberías ver: [EMAIL] Password reset email sent to ...
```

### Unit Tests

```bash
cd server
npm test                      # Ejecutar todos los tests
npm test -- --watch          # Watch mode
npm test -- auth.service     # Test específico
```

---

## 🆘 Troubleshooting

### Error: `npm: command not found`

**Solución**: Instala Node.js desde <https://nodejs.org/>

### Error: `docker-compose: command not found`

**Solución**: Instala Docker Desktop desde <https://docker.com/>

### Error: `ECONNREFUSED - Cannot connect to database`

**Solución**:

```bash
# 1. Verificar Docker está corriendo
docker ps

# 2. Iniciar servicios
docker-compose up -d

# 3. Verificar credentials en .env
grep "^DB_" server/.env
```

### Error: `JWT_SECRET is required`

**Solución**: Ve a la sección [Generar Claves JWT Seguras](#-generar-claves-jwt-seguras) en este documento

### Error: `RESEND_API_KEY is missing`

**Solución**:

```bash
# 1. Ir a https://resend.com
# 2. Crear API token
# 3. Agregar a .env:
echo "RESEND_API_KEY=re_..." >> server/.env
```

### Error: `Port 3000/3001 already in use`

**Solución**:

```bash
# Cambiar puerto en .env
PORT=3002              # Backend

# O matar proceso existente
lsof -i :3001 | grep node | awk '{print $2}' | xargs kill -9
```

### Frontend no conecta a Backend

**Solución**:

```bash
# 1. Verificar backend está corriendo
curl http://localhost:3001/health

# 2. Verificar CORS en .env
grep "CORS_ORIGIN" server/.env

# 3. Verificar NEXT_PUBLIC_API_URL en frontend
grep "NEXT_PUBLIC_API_URL" client/.env.local
```

### Tests no pasan

**Solución**:

```bash
# 1. Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# 2. Ejecutar con verbose
npm test -- --verbose
```

---

## 📚 Referencias

### Documentación Oficial

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

### Guías Relacionadas

- [Setup.md](SETUP.md) - Configuración, seguridad e inicialización (todo en un único documento)
- [README.md](README.md) - Información del proyecto

### Comandos Útiles

```bash
# Database
docker-compose ps              # Ver estado de servicios
docker-compose logs postgres   # Ver logs de BD
docker-compose down            # Detener servicios

# Git
git status
git add .
git commit -m "message"
git push

# Node
npm list                       # Ver paquetes instalados
npm outdated                   # Ver actualizaciones disponibles
npm audit                      # Revisar vulnerabilidades
```

---

## ✅ Checklist de Setup

- [ ] Node.js v18+ instalado
- [ ] Docker instalado
- [ ] Repositorio clonado
- [ ] `docker-compose up -d` ejecutado
- [ ] `.env` copiado y llenado
- [ ] `npm install` en server y client
- [ ] Backend levantado (`npm run dev`)
- [ ] Frontend levantado (`npm run dev`)
- [ ] Ambos accesibles en localhost
- [ ] Pruebas de registro/login funcionan
- [ ] Email configurado correctamente

---

**¿Necesitas ayuda?** Revisa la sección [🆘 Troubleshooting](#-troubleshooting) en este documento
