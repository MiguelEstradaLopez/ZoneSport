# 🔐 Recuperación de Contraseña

## Descripción General

El sistema de recuperación de contraseña permite a los usuarios restablecer su contraseña a través de un enlace de correo electrónico seguro y temporal.

## Características

- ✅ Solicitud de reset mediante email
- ✅ Tokens JWT con expiración de 1 hora
- ✅ Almacenamiento seguro de tokens en base de datos
- ✅ Validación de tokens antes de permitir reset
- ✅ Emails HTML formateados
- ✅ Manejo de errores completo
- ✅ Frontend pages para UX fluido

## Flujo del Proceso

```
1. Usuario accede a /olvide-contrasena
2. Ingresa su email
3. Backend genera token JWT (1h expiration)
4. Se envía email con enlace reset
5. Usuario hace click en enlace
6. Llega a /reset-password/[token]
7. Token se valida automáticamente
8. Usuario ingresa nueva contraseña
9. Contraseña se actualiza y token se elimina
10. Redirige a /login
```

## Endpoints API

### POST /auth/forgot-password

Solicita un enlace de recuperación de contraseña.

**Request:**

```json
{
  "email": "usuario@example.com"
}
```

**Response:**

```json
{
  "message": "Si el email existe en nuestro sistema, recibirás un enlace de recuperación"
}
```

**Nota:** Por seguridad, siempre retorna el mismo mensaje aunque el email no exista.

---

### GET /auth/validate-reset-token/:token

Valida que un token de reset sea válido y no haya expirado.

**Response (válido):**

```json
{
  "email": "usuario@example.com",
  "firstName": "Juan"
}
```

**Response (inválido):**

```json
{
  "message": "El enlace de recuperación no es válido o ha expirado"
}
```

---

### POST /auth/reset-password

Actualiza la contraseña usando un token válido.

**Request:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "nuevaContraseña123"
}
```

**Response:**

```json
{
  "message": "Tu contraseña ha sido actualizada exitosamente"
}
```

**Errores posibles:**

- Token inválido o expirado
- Contraseña muy corta (< 6 caracteres)

## Configuración de Email

### Opción 1: Gmail (Recomendado para desarrollo)

1. Accede a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Genera una contraseña de aplicación
3. Configura las variables de entorno:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-contrasena-app
SMTP_FROM=noreply@zonesport.com
```

### Opción 2: Mailtrap (Para testing)

1. Crea una cuenta en [mailtrap.io](https://mailtrap.io)
2. Copia las credenciales SMTP
3. Configura en `.env`:

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=tu-usuario-mailtrap
SMTP_PASSWORD=tu-password-mailtrap
```

### Opción 3: Servicio personalizado

Puedes usar cualquier servicio SMTP. Solo actualiza las variables:

```env
SMTP_HOST=tu-host-smtp
SMTP_PORT=puerto
SMTP_SECURE=true/false
SMTP_USER=usuario
SMTP_PASSWORD=contraseña
```

## Modelo de Datos

### Entidad PasswordResetToken

```typescript
@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'text' })
  token: string;  // JWT firmado

  @Column()
  expiresAt: Date;  // Fecha de expiración

  @CreateDateColumn()
  createdAt: Date;
}
```

## Seguridad

✅ **Medidas implementadas:**

1. Tokens JWT firmados con JWT_RESET_SECRET
2. Expiración automática de 1 hora
3. Validación de token antes de cambiar contraseña
4. Tokens eliminados después de uso
5. Cascada de eliminación si se elimina usuario
6. Contraseñas hasheadas con bcrypt (10 rounds)
7. Mensajes genéricos para prevenir enumeración de usuarios

⚠️ **Consideraciones de producción:**

- Cambiar `JWT_SECRET` y `JWT_RESET_SECRET` en variables de entorno
- Usar SMTP_SECURE=true si es posible (puerto 465)
- Configurar FRONTEND_URL correctamente
- Implementar rate limiting en los endpoints
- Registrar intentos sospechosos
- Usar HTTPS en producción

## Testeo

### Manual (curl)

```bash
# 1. Solicitar reset
curl -X POST http://localhost:3001/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com"}'

# 2. Validar token (reemplazar TOKEN)
curl http://localhost:3001/auth/validate-reset-token/TOKEN

# 3. Reset password
curl -X POST http://localhost:3001/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN","newPassword":"nueva123"}'
```

### Frontend

1. Accede a `http://localhost:3000/olvide-contrasena`
2. Ingresa email registrado
3. Busca el enlace en tu bandeja (o servicio de email)
4. Click en el enlace
5. Ingresa nueva contraseña
6. Confirma contraseña
7. Click "Actualizar Contraseña"
8. Deberías ser redirigido a login

## Páginas Frontend

### /olvide-contrasena

- Formulario para ingresar email
- Validación de email
- Estados de carga y error
- Redirige a login después de envío

### /reset-password/[token]

- Validación automática de token al cargar
- Inputs para nueva contraseña y confirmación
- Validación de fortaleza (mín 6 caracteres)
- Match de contraseñas
- Estados de carga
- Redirige a login después de actualizar

## Archivos Relevantes

**Backend:**

- `/server/src/email/email.service.ts` - Servicio de email
- `/server/src/email/email.module.ts` - Módulo de email
- `/server/src/auth/auth.service.ts` - Métodos de reset
- `/server/src/auth/auth.controller.ts` - Endpoints
- `/server/src/auth/entities/password-reset-token.entity.ts` - Modelo DB
- `/server/src/auth/dtos/forgot-password.dto.ts` - DTO solicitud
- `/server/src/auth/dtos/reset-password.dto.ts` - DTO reset

**Frontend:**

- `/client/app/olvide-contrasena/page.tsx` - Página solicitud
- `/client/app/reset-password/[token]/page.tsx` - Página reset
- `/client/app/login/page.tsx` - Link "Olvidé contraseña"

## Troubleshooting

**P: No recibo el email**

R: Verifica:

1. Variables SMTP configuradas en `.env`
2. Credenciales de email son correctas
3. Si usas Gmail: verificaste el email con 2FA habilitado
4. Si usas Mailtrap: revisa bandeja de "Inbox"
5. Revisa console del servidor para errores

**P: Token expirado**

R: Los tokens duran 1 hora. El usuario debe acceder dentro de ese tiempo.

**P: Error "El email ya está registrado"**

R: Debes registrarte primero en `/registrar` antes de poder hacer reset.

**P: Las contraseñas no coinciden**

R: Verifica que ambas contraseñas sean idénticas.

## Variables de Entorno Requeridas

```env
# Obligatorias
JWT_SECRET=algo-secreto
JWT_RESET_SECRET=algo-secreto-reset
SMTP_HOST=smtp.ejemplo.com
SMTP_PORT=587
SMTP_USER=usuario@ejemplo.com
SMTP_PASSWORD=contraseña-app

# Opcionales
SMTP_SECURE=false
SMTP_FROM=noreply@ejemplo.com
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```
