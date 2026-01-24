# 🚀 Configuración y Desarrollo - ZoneSport

> Guía completa para configurar, desarrollar y testear ZoneSport

---

## 📋 Tabla de Contenidos

1. [Inicio Rápido](#-inicio-rápido)
2. [Configuración Inicial](#-configuración-inicial)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Desarrollo](#-desarrollo)
5. [Testing](#-testing)
6. [Troubleshooting](#-troubleshooting)
7. [Referencias](#-referencias)

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

Ver [SECURITY.md](SECURITY.md) para detalles completos.

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
├── SECURITY.md                   # Guía de seguridad
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

**Solución**: Ve a [SECURITY.md](SECURITY.md) sección "JWT_SECRET"

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

- [SECURITY.md](SECURITY.md) - Configuración de seguridad y .env
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

**¿Necesitas ayuda?** Revisa el troubleshooting arriba o consulta [SECURITY.md](SECURITY.md)
