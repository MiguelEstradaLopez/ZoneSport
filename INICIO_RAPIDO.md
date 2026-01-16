# 🚀 Guía de Inicio Rápido - ZoneSport

## ¡Bienvenido! El proyecto está completamente configurado y listo para usar.

---

## 📋 Requisitos

- Node.js v18+
- Docker y Docker Compose
- Git

---

## ⚡ Inicio en 3 Pasos

### 1️⃣ Iniciar la Base de Datos
```bash
docker-compose up -d
```
✅ PostgreSQL estará corriendo en `localhost:5432`

### 2️⃣ Backend (Terminal 1)
```bash
cd server
npm install
npm run start:dev
```
✅ API disponible en `http://localhost:3001`

### 3️⃣ Frontend (Terminal 2)
```bash
cd client
npm install
npm run dev
```
✅ Aplicación disponible en `http://localhost:3000`

---

## 🌐 Acceso

**Frontend**: http://localhost:3000
**Backend API**: http://localhost:3001
**Base de Datos**: localhost:5432

---

## 🗂️ Estructura del Proyecto

```
ZoneSport/
├── client/                 # Frontend Next.js
│   ├── app/               # Páginas
│   │   ├── page.tsx       # Home
│   │   ├── eventos/       # Listado de eventos
│   │   ├── eventos/[id]/  # Detalles de evento
│   │   ├── clasificacion/ # Tablas de clasificación
│   │   ├── perfil/        # Perfil de usuario
│   │   ├── noticias/      # Noticias deportivas
│   │   └── registrar/     # Registro de usuarios
│   ├── components/        # Componentes reutilizables
│   │   └── layout/Navbar.tsx
│   ├── services/          # Servicios HTTP
│   │   ├── api.ts
│   │   ├── usersService.ts
│   │   ├── eventsService.ts
│   │   ├── matchesService.ts
│   │   ├── sportsService.ts
│   │   └── classificationsService.ts
│   ├── .env.local         # Variables de entorno
│   └── package.json
│
├── server/                # Backend NestJS
│   ├── src/
│   │   ├── app.module.ts  # Módulo principal
│   │   ├── main.ts        # Punto de entrada
│   │   ├── users/         # Módulo de usuarios
│   │   ├── sports/        # Módulo de deportes
│   │   ├── events/        # Módulo de eventos
│   │   ├── matches/       # Módulo de partidos
│   │   └── classifications/ # Módulo de clasificación
│   ├── .env               # Variables de entorno
│   └── package.json
│
├── docker-compose.yml     # Configuración Docker
├── README.md              # Documentación principal
├── IMPLEMENTACION.md      # Detalles de implementación
└── ZoneSport.pdf          # Especificaciones

```

---

## 🔌 Prueba Rápida de la API

### Registrar Usuario
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "atleta@zonesport.com",
    "password": "123456",
    "firstName": "Juan",
    "lastName": "Pérez"
  }'
```

### Obtener Usuarios
```bash
curl http://localhost:3001/users
```

### Obtener Eventos
```bash
curl http://localhost:3001/events
```

---

## 📱 Funcionalidades Principales

✅ **Registro de Usuarios**: Crear cuentas de atletas/organizadores
✅ **Gestión de Eventos**: Crear torneos y eventos deportivos
✅ **Partidos**: Registrar resultados de partidos
✅ **Tablas de Clasificación**: Dinámicas y automáticas
✅ **Perfil de Usuario**: Ver y editar información
✅ **Noticias**: Listado de noticias deportivas

---

## 🎨 Colores Corporativos

- **Azul Profundo**: #007ACC
- **Verde Lima**: #8BC34A
- **Fondo Oscuro**: #0f172a (slate-900)

---

## 📊 Módulos Backend

| Módulo | Entidad | Endpoints | CRUD |
|--------|---------|-----------|------|
| Users | User | `/users` | ✅ |
| Sports | Sport | `/sports` | ✅ |
| Events | Event | `/events` | ✅ |
| Matches | Match | `/matches` | ✅ |
| Classifications | Classification | `/classifications` | ✅ |

---

## 🧪 Comandos Útiles

### Backend
```bash
# Desarrollo con hot reload
npm run start:dev

# Producción
npm run start:prod

# Tests
npm run test
npm run test:e2e

# Linting
npm run lint
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm run start

# Linting
npm run lint
```

---

## 🆘 Solución de Problemas

### Error de conexión a BD
```bash
# Verificar que Docker está corriendo
docker ps

# Ver logs de la BD
docker logs zonesport_db
```

### Puerto en uso
```bash
# Si 3001 está ocupado, cambiar en server/src/main.ts
await app.listen(3002);

# Si 3000 está ocupado, cambiar puerto en Next.js
npm run dev -- -p 3002
```

### Base de datos no existe
```bash
# Dentro del contenedor Docker
docker exec -it zonesport_db psql -U miki_user

# Crear base de datos
CREATE DATABASE zonesport_db;
```

---

## 📚 Documentación Adicional

- [README.md](./README.md) - Documentación completa
- [IMPLEMENTACION.md](./IMPLEMENTACION.md) - Detalles técnicos
- [ZoneSport.pdf](./ZoneSport.pdf) - Especificaciones del proyecto

---

## ✨ Características Implementadas

- ✅ Base de datos PostgreSQL con Docker
- ✅ API REST completa con NestJS
- ✅ Frontend moderno con Next.js 15
- ✅ Autenticación lista para JWT
- ✅ Validación de datos con class-validator
- ✅ Tablas de clasificación dinámicas
- ✅ Diseño responsive
- ✅ Identidad visual corporativa
- ✅ Servicios HTTP typados
- ✅ Documentación completa

---

## 🎯 Próximos Pasos

1. Registra un usuario: http://localhost:3000/registrar
2. Crea un deporte: POST a `/sports`
3. Crea un evento: POST a `/events`
4. Crea partidos: POST a `/matches`
5. Registra resultados: POST a `/matches/:id/result`
6. Visualiza la clasificación: http://localhost:3000/clasificacion

---

## 💡 Tips

- Las contraseñas se hashean automáticamente con bcrypt
- Las clasificaciones se actualizan dinámicamente
- CORS está habilitado para desarrollo
- TypeScript en todo el proyecto
- Tailwind CSS para estilos

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en la terminal
2. Verifica que Docker esté corriendo
3. Confirma que los puertos 3000, 3001 y 5432 estén disponibles
4. Consulta el archivo [IMPLEMENTACION.md](./IMPLEMENTACION.md)

---

**¡Listo para empezar! 🎉**

Construido con ❤️ para ZoneSport Antioquia
