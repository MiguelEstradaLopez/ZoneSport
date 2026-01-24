# 🔌 Guía de API - ZoneSport

Esta guía te mostrará cómo acceder y usar la documentación interactiva de Swagger para probar todos los endpoints de la API de ZoneSport.

## 📚 Tabla de Contenidos

1. [Acceso a Swagger](#acceso-a-swagger)
2. [Interfaz de Swagger](#interfaz-de-swagger)
3. [Autenticación (JWT)](#autenticación-jwt)
4. [Endpoints de Autenticación](#endpoints-de-autenticación)
5. [Endpoints de Usuarios](#endpoints-de-usuarios)
6. [Códigos de Respuesta](#códigos-de-respuesta)
7. [Ejemplos de Uso](#ejemplos-de-uso)
8. [Troubleshooting](#troubleshooting)

---

## 🌐 Acceso a Swagger

### Paso 1: Iniciar el servidor backend

```bash
cd server
npm run dev
```

Espera a ver el mensaje:

```
[Nest] XXXX LOG [NestFactory] Starting Nest application...
```

### Paso 2: Abrir Swagger UI

Abre tu navegador web e ve a:

```
http://localhost:3001/api/docs
```

Deberías ver una interfaz interactiva con todos los endpoints disponibles.

---

## 🎨 Interfaz de Swagger

### Componentes principales

```
┌─────────────────────────────────────────────────────┐
│  ZoneSport API v1.0.0                              │
├─────────────────────────────────────────────────────┤
│ ☐ auth          (Autenticación y Login)            │
│ ☐ users         (Gestión de Usuarios)              │
│ ☐ sports        (Deportes)                         │
│ ☐ events        (Eventos)                          │
│ ☐ matches       (Partidos)                         │
└─────────────────────────────────────────────────────┘
```

### Cómo usar

1. **Expandir categorías**: Haz clic en los nombres de las categorías (auth, users, etc.) para ver los endpoints
2. **Expandir endpoint**: Haz clic en el endpoint específico para ver detalles
3. **Try it out**: Haz clic en el botón azul "Try it out" para hacer una solicitud real
4. **Ejecutar**: Rellena los campos necesarios y haz clic en "Execute"

---

## 🔐 Autenticación (JWT)

### ¿Qué es JWT?

JWT (JSON Web Token) es un token que se envía en las cabeceras de las solicitudes autenticadas para identificar al usuario.

### Flujo de autenticación

```
1. Usuario se registra con email y contraseña
2. Sistema devuelve un accessToken (JWT)
3. Usuario envía este token en cabecera Authorization
4. API valida el token y procesa la solicitud
5. Si token expira, usuario debe hacer login de nuevo
```

### Cómo usar el token en Swagger

1. Primero, **registra un usuario** o **inicia sesión** (endpoints sin autenticación)
2. Copia el `accessToken` de la respuesta
3. Haz clic en el botón verde **"Authorize"** en la esquina superior derecha
4. Pega el token en el campo (sin agregar "Bearer ", Swagger lo hace automáticamente)
5. Haz clic en "Authorize"
6. Ahora puedes usar endpoints protegidos ✅

---

## 📝 Endpoints de Autenticación

### 1. Registrar Usuario

```
POST /auth/register
```

**Body (JSON):**

```json
{
  "email": "juan@example.com",
  "password": "MiPassword123!",
  "firstName": "Juan",
  "lastName": "García",
  "phoneNumber": "+34612345678"
}
```

**Respuesta exitosa (201):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "firstName": "Juan",
    "lastName": "García",
    "createdAt": "2026-01-23T15:30:00.000Z"
  }
}
```

---

### 2. Iniciar Sesión

```
POST /auth/login
```

**Body (JSON):**

```json
{
  "email": "juan@example.com",
  "password": "MiPassword123!"
}
```

**Respuesta exitosa (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "firstName": "Juan",
    "lastName": "García"
  }
}
```

**Errores comunes:**

- **401**: Email o contraseña inválidos
- **400**: Campos faltantes

---

### 3. Obtener Perfil (Requiere autenticación)

```
GET /auth/profile
```

**Headers necesarios:**

```
Authorization: Bearer <tu_accessToken>
```

**Respuesta (200):**

```json
{
  "id": 1,
  "email": "juan@example.com",
  "firstName": "Juan",
  "lastName": "García",
  "phoneNumber": "+34612345678",
  "createdAt": "2026-01-23T15:30:00.000Z"
}
```

---

### 4. Solicitar Reset de Contraseña

```
POST /auth/forgot-password
```

**Body (JSON):**

```json
{
  "email": "juan@example.com"
}
```

**Respuesta (200):**

```json
{
  "message": "Email de reset enviado a tu correo",
  "resetToken": "abc123xyz..."
}
```

**Nota:** El token se envía también por correo (configurado con Resend)

---

### 5. Resetear Contraseña

```
POST /auth/reset-password
```

**Body (JSON):**

```json
{
  "token": "abc123xyz...",
  "newPassword": "NuevaPassword456!"
}
```

**Respuesta (200):**

```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

---

### 6. Validar Token de Reset

```
GET /auth/validate-reset-token/{token}
```

**Parámetro URL:**

- `token`: El token de reset recibido por email

**Respuesta (200):**

```json
{
  "valid": true,
  "expiresIn": 3600
}
```

---

## 👥 Endpoints de Usuarios

### 1. Crear Usuario

```
POST /users
```

**Body (JSON):**

```json
{
  "email": "maria@example.com",
  "password": "Password789!",
  "firstName": "María",
  "lastName": "López"
}
```

**Respuesta (201):**

```json
{
  "id": 2,
  "email": "maria@example.com",
  "firstName": "María",
  "lastName": "López",
  "createdAt": "2026-01-23T16:00:00.000Z"
}
```

---

### 2. Obtener Todos los Usuarios

```
GET /users
```

**Respuesta (200):**

```json
[
  {
    "id": 1,
    "email": "juan@example.com",
    "firstName": "Juan",
    "lastName": "García"
  },
  {
    "id": 2,
    "email": "maria@example.com",
    "firstName": "María",
    "lastName": "López"
  }
]
```

---

### 3. Obtener Usuario por ID

```
GET /users/{id}
```

**Parámetro URL:**

- `id`: ID del usuario (ejemplo: 1)

**Respuesta (200):**

```json
{
  "id": 1,
  "email": "juan@example.com",
  "firstName": "Juan",
  "lastName": "García",
  "phoneNumber": "+34612345678",
  "createdAt": "2026-01-23T15:30:00.000Z"
}
```

---

### 4. Buscar Usuario por Email (Requiere autenticación)

```
GET /users/search/email?email=juan@example.com
```

**Parámetro Query:**

- `email`: Email a buscar

**Headers necesarios:**

```
Authorization: Bearer <tu_accessToken>
```

**Respuesta (200):**

```json
[
  {
    "id": 1,
    "email": "juan@example.com",
    "firstName": "Juan",
    "lastName": "García"
  }
]
```

---

### 5. Actualizar Usuario

```
PATCH /users/{id}
```

**Parámetro URL:**

- `id`: ID del usuario

**Body (JSON):** (todos los campos son opcionales)

```json
{
  "firstName": "Juan Carlos",
  "phoneNumber": "+34698765432"
}
```

**Respuesta (200):**

```json
{
  "id": 1,
  "email": "juan@example.com",
  "firstName": "Juan Carlos",
  "lastName": "García",
  "phoneNumber": "+34698765432"
}
```

---

### 6. Eliminar Usuario

```
DELETE /users/{id}
```

**Parámetro URL:**

- `id`: ID del usuario a eliminar

**Respuesta (200):**

```json
{
  "message": "Usuario eliminado exitosamente"
}
```

---

## 📊 Códigos de Respuesta

| Código | Significado | Descripción |
|--------|-------------|-------------|
| **200** | ✅ OK | La solicitud fue exitosa |
| **201** | ✅ Created | Recurso creado exitosamente |
| **400** | ❌ Bad Request | Datos inválidos o faltantes |
| **401** | ❌ Unauthorized | No autenticado o token inválido |
| **403** | ❌ Forbidden | No tienes permiso para acceder |
| **404** | ❌ Not Found | Recurso no encontrado |
| **409** | ❌ Conflict | El recurso ya existe (ej: email duplicado) |
| **500** | ❌ Server Error | Error interno del servidor |

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Flujo completo de Registro y Login

#### Paso 1: Registrarse

En Swagger, ve a **auth → POST /auth/register**

```json
{
  "email": "nuevo@example.com",
  "password": "MiPassword123!",
  "firstName": "Carlos",
  "lastName": "Menéndez"
}
```

Copia el `accessToken` de la respuesta.

#### Paso 2: Usar el token en Swagger

1. Haz clic en el botón verde **"Authorize"** (arriba a la derecha)
2. Pega el token:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Haz clic en "Authorize"

#### Paso 3: Ver tu perfil

Ve a **auth → GET /auth/profile** y haz clic en "Try it out" → "Execute"

Verás tus datos de usuario.

---

### Ejemplo 2: Crear y actualizar usuario

#### Paso 1: Crear usuario

Ve a **users → POST /users**

```json
{
  "email": "nuevo@example.com",
  "password": "Password123!",
  "firstName": "Pedro",
  "lastName": "Sánchez"
}
```

Copia el `id` de la respuesta (ejemplo: 5)

#### Paso 2: Actualizar usuario

Ve a **users → PATCH /users/{id}**

1. En el campo `id`, escribe: `5`
2. En el Body:

```json
{
  "phoneNumber": "+34678901234"
}
```

3. Haz clic en "Execute"

---

### Ejemplo 3: Buscar usuario por email

#### Requisito: Token de autenticación

1. Obtén un token (ver Ejemplo 1, Paso 1)
2. Autorízate en Swagger (Ejemplo 1, Paso 2)
3. Ve a **users → GET /users/search/email**
4. Haz clic en "Try it out"
5. En `email`, escribe: `nuevo@example.com`
6. Haz clic en "Execute"

---

### Ejemplo 4: Flujo de reset de contraseña

#### Paso 1: Solicitar reset

Ve a **auth → POST /auth/forgot-password**

```json
{
  "email": "nuevo@example.com"
}
```

Recibirás un email con un token (verificar en Resend).

#### Paso 2: Validar el token

Ve a **auth → GET /auth/validate-reset-token/{token}**

1. En el campo `token`, pega el token del email
2. Haz clic en "Execute"

Si ves `"valid": true`, puedes resetear la contraseña.

#### Paso 3: Cambiar contraseña

Ve a **auth → POST /auth/reset-password**

```json
{
  "token": "token_del_email",
  "newPassword": "NuevaPassword999!"
}
```

Haz clic en "Execute" y tu contraseña habrá sido actualizada.

---

## 🔍 Estructura típica del Body

### Para endpoints de crear/actualizar

```json
{
  "email": "usuario@example.com",      // string, requerido en crear
  "password": "Password123!",           // string, requerido en crear
  "firstName": "Juan",                  // string, opcional
  "lastName": "García",                 // string, opcional
  "phoneNumber": "+34612345678"         // string, opcional
}
```

### Reglas de validación

- **email**: Formato válido de email (ej: <user@domain.com>)
- **password**: Mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números
- **firstName/lastName**: Máximo 50 caracteres
- **phoneNumber**: Formato internacional (ej: +34612345678)

---

## 🛠️ Troubleshooting

### ❌ Error: "No authorization server configured"

**Solución:**

1. Asegúrate de haber hecho login o registrado
2. Tienes un `accessToken` válido
3. Copia correctamente el token (sin espacios)
4. Haz clic en "Authorize", no en otro lugar

---

### ❌ Error: "401 Unauthorized"

**Causas comunes:**

- Token expirado: Haz login de nuevo
- Token inválido: Cópialo correctamente
- No incluiste el token en la solicitud

**Solución:**

1. Ve a **auth → POST /auth/login**
2. Inicia sesión con tus credenciales
3. Copia el nuevo `accessToken`
4. Haz clic en "Authorize" y pega el token
5. Intenta de nuevo

---

### ❌ Error: "400 Bad Request"

**Causas comunes:**

- Campos faltantes
- Formato incorrecto de datos
- JSON mal formado

**Solución:**

1. Verifica que todos los campos requeridos estén presentes
2. Usa el formato JSON correcto:

   ```json
   {
     "email": "user@example.com",
     "password": "Pass123"
   }
   ```

3. No incluyas comillas extra o caracteres inválidos

---

### ❌ Error: "409 Conflict" (email duplicado)

**Causa:** El email ya existe en la base de datos

**Solución:**

- Usa un email diferente
- O haz login con ese email si ya tienes cuenta

---

### ❌ Swagger UI no carga

**Comprobaciones:**

1. ¿El backend está corriendo? `npm run dev` en `/server`
2. ¿Está en puerto 3001? Verifica: `http://localhost:3001`
3. Abre la consola (F12) y revisa errores
4. Intenta refrescar la página (Ctrl+F5)

---

### ❌ No puedo conectarme desde frontend

**Comprobaciones:**

1. Backend en puerto 3001: `http://localhost:3001`
2. Frontend en puerto 3000: `http://localhost:3000`
3. El archivo `.env` en la raíz tiene `API_URL=http://localhost:3001`
4. Frontend importa correctamente la variable de entorno

---

## 📋 Resumen rápido

| Acción | Endpoint | Método | Autenticación |
|--------|----------|--------|---------------|
| Registrarse | `/auth/register` | POST | ❌ No |
| Iniciar sesión | `/auth/login` | POST | ❌ No |
| Ver perfil | `/auth/profile` | GET | ✅ Sí |
| Cambiar contraseña | `/auth/reset-password` | POST | ❌ No |
| Crear usuario | `/users` | POST | ❌ No |
| Listar usuarios | `/users` | GET | ❌ No |
| Obtener usuario | `/users/:id` | GET | ❌ No |
| Buscar usuario | `/users/search/email` | GET | ✅ Sí |
| Actualizar usuario | `/users/:id` | PATCH | ❌ No |
| Eliminar usuario | `/users/:id` | DELETE | ❌ No |

---

## 🚀 Próximos pasos

1. **Accede a Swagger**: <http://localhost:3001/api/docs>
2. **Registra un usuario** o inicia sesión
3. **Autorízate** con tu token
4. **Prueba los endpoints** usando "Try it out"
5. **Revisa las respuestas** para entender la estructura de datos
6. **Conecta tu frontend** para consumir la API

---

## 📚 Recursos adicionales

- [Documentación de NestJS](https://docs.nestjs.com)
- [Documentación de Swagger](https://swagger.io/tools/swagger-ui/)
- [JWT - JSON Web Tokens](https://jwt.io)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**Última actualización:** 23 de enero de 2026  
**Versión:** 1.0  
**Autor:** ZoneSport API Team
