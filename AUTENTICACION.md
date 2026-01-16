# 🔐 Autenticación JWT - ZoneSport

## ✅ Implementado

### Backend (NestJS)

**Módulo Auth Completamente Funcional:**

1. **Endpoints:**
   - `POST /auth/register` - Crear nueva cuenta
   - `POST /auth/login` - Iniciar sesión  
   - `GET /auth/profile` - Obtener perfil del usuario autenticado

2. **Características:**
   - ✅ JWT tokens con expiración de 24 horas
   - ✅ Validación de email con regex
   - ✅ Hash de contraseñas con bcrypt
   - ✅ Todos los nuevos usuarios son ATHLETE por defecto
   - ✅ Guards JWT para proteger rutas privadas
   - ✅ Decorador `@CurrentUser()` para acceder al usuario autenticado

3. **Endpoints Protegidos:**
   - `POST /events` - Crear evento (requiere autenticación, organizer = usuario actual)
   - `PATCH /events/:id` - Editar evento (solo si es el organizador)
   - `DELETE /events/:id` - Eliminar evento (solo si es el organizador)
   - `POST /news` - Crear noticia (requiere autenticación, autor = usuario actual)
   - `PATCH /news/:id` - Editar noticia (solo si es el autor)
   - `DELETE /news/:id` - Eliminar noticia (solo si es el autor)

4. **Búsqueda de Usuarios:**
   - `GET /users/search/email?email=xxx` - Buscar usuarios por email (protegido con JWT)

5. **Módulo News (Noticias):**
   - GET público para listar noticias
   - POST/PATCH/DELETE protegidos para crear/editar/eliminar noticias

### Frontend (Next.js)

**Páginas Creadas:**

1. **`/login`** - Formulario de inicio de sesión
   - Email y contraseña
   - Manejo de errores
   - Link a registro

2. **`/registrar`** - Formulario de registro mejorado
   - Email, contraseña, nombre, apellido, teléfono
   - Validación completa
   - Guarda JWT automáticamente
   - Link a login

3. **`/crear-evento`** - Crear nuevo evento (requiere autenticación)
   - Selección de deporte
   - Fechas de inicio/fin
   - Descripción
   - Redirige a /eventos al crear

**Navbar Actualizado:**

- Muestra botones Login/Registrarse si no está autenticado
- Muestra dropdown de perfil si está autenticado
- Opción "Crear Evento" en el dropdown
- Botón "Cerrar Sesión"

**Servicio de Autenticación:**

```typescript
authService.login(credentials)        // Inicia sesión y guarda JWT
authService.register(userData)        // Registra nuevo usuario
authService.logout()                  // Cierra sesión
authService.isAuthenticated()         // Verifica si está logueado
authService.getUser()                 // Obtiene datos del usuario
authService.getToken()                // Obtiene el JWT token
```

---

## 🔑 Cómo Usar

### Registro

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "deportista@example.com",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+57 123456789"
  }'

# Respuesta:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "deportista@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "ATHLETE"
  }
}
```

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "deportista@example.com", "password": "password123"}'
```

### Crear Evento (Autenticado)

```bash
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "name": "Torneo Fútbol Medellín",
    "description": "Torneo comunitario de fútbol",
    "startDate": "2026-02-15T10:00:00",
    "endDate": "2026-02-20T18:00:00",
    "sportId": 1,
    "organizerId": 1
  }'
```

### Obtener Perfil

```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer [TOKEN]"
```

### Buscar Usuarios por Email

```bash
curl -X GET "http://localhost:3001/users/search/email?email=deportista" \
  -H "Authorization: Bearer [TOKEN]"
```

---

## 🎯 Roles y Permisos

| Acción | ATHLETE | ORGANIZER | ADMIN |
|--------|---------|-----------|-------|
| Ver eventos | ✅ | ✅ | ✅ |
| Crear eventos | ✅ | ✅ | ✅ |
| Editar mis eventos | ✅ | ✅ | ✅ |
| Editar eventos otros | ❌ | ❌ | ✅ |
| Crear noticias | ✅ | ✅ | ✅ |
| Ver clasificación | ✅ | ✅ | ✅ |

**Nota:** Actualmente todos los usuarios nuevos se registran como ATHLETE. La escalación a ORGANIZER/ADMIN se debe hacer directamente en la BD si es necesario.

---

## 🔄 Flujo de Autenticación

```
1. Usuario entra a /registrar
2. Completa form con email, contraseña, etc
3. POST /auth/register
4. Backend valida email y crea usuario con bcrypt
5. Devuelve JWT y datos del usuario
6. Frontend guarda JWT en localStorage
7. Usuario redirigido a home
8. Navbar muestra perfil y opción "Crear Evento"
9. Al crear evento, JWT se envía en header Authorization
10. Backend verifica JWT y asigna organizerId = usuario.id
```

---

## 🛡️ Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ JWT con expiración de 24 horas
- ✅ Guards en rutas privadas
- ✅ Validación de email con regex
- ✅ Validación de roles y permisos
- ✅ CORS configurado
- ✅ Las contraseñas NUNCA se devuelven en respuestas

---

## 📝 Variables de Entorno

Backend (`.env`):

```
DATABASE_URL=postgresql://miki_user:7667@localhost:5432/zonesport_db
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

Frontend (`.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🚀 Próximas Funcionalidades

- [ ] Recuperación de contraseña
- [ ] Verificación de email con OTP
- [ ] Google OAuth2 integration
- [ ] Sistema de invitaciones a eventos
- [ ] Notificaciones por email
- [ ] Roles ORGANIZER y ADMIN con permisos específicos
- [ ] Rate limiting en endpoints
