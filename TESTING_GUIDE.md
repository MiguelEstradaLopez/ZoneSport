# 🧪 Guía de Testing - ZoneSport

## 📋 Quick Start

### 1. Iniciar Backend

```bash
cd /home/miki/Proyectos/ZoneSport/server
npm run dev
```

Deberías ver:

```
[Nest] 12345  - 01/23/2026, 10:00:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/23/2026, 10:00:01 PM     LOG [InstanceLoader] ...
Listening on port 3001
```

### 2. Iniciar Frontend (en otra terminal)

```bash
cd /home/miki/Proyectos/ZoneSport/client
npm run dev
```

Deberías ver:

```
Local:        http://localhost:3000
```

## 🧪 Test 1: Registro y Login

### Paso 1.1: Ir a Registro

- URL: `http://localhost:3000/registrar`
- Llenar formulario:
  - Email: `test@zonesport.com`
  - Contraseña: `TestPass123!`
  - Nombre: `Juan`
  - Apellido: `García`
  - Teléfono: `123456789`

### Paso 1.2: Revisar Logs del Backend

En la consola del backend deberías ver:

```
[AUTH] register - Password hashed for: test@zonesport.com
[AUTH] register - User created successfully: test@zonesport.com
[EMAIL] Welcome email sent to test@zonesport.com
```

### Paso 1.3: Revisar Resend

- Ir a <https://resend.com/emails>
- Buscar email a `test@zonesport.com`
- Deberías ver el "Welcome to ZoneSport" email ✅

### Paso 1.4: Intentar Login

- URL: `http://localhost:3000/login`
- Email: `test@zonesport.com`
- Contraseña: `TestPass123!`

En la consola del backend deberías ver:

```
[AUTH] login - Attempting login for: test@zonesport.com
[AUTH] validateUser - User found: YES
[AUTH] validateUser - Password valid: YES
[AUTH] login - Validation successful for: test@zonesport.com
```

**⚠️ Si ves "Password valid: NO"**

- Significa que el bcrypt.compare() falla
- Revisar: ¿Fue el password hasheado al registrarse?
- Revisar: ¿Se guardó el hash en la BD?

## 🧪 Test 2: Recuperación de Contraseña

### Paso 2.1: Olvidé Contraseña

- URL: `http://localhost:3000/olvide-contrasena`
- Email: `test@zonesport.com`

En la consola del backend deberías ver:

```
[AUTH] forgotPassword - Processing for: test@zonesport.com
[AUTH] forgotPassword - User found: test@zonesport.com
[AUTH] forgotPassword - Reset token saved for: test@zonesport.com
[EMAIL] Password reset email sent to test@zonesport.com
```

### Paso 2.2: Revisar Email

- Ir a <https://resend.com/emails>
- Buscar email a `test@zonesport.com`
- Deberías ver el "Recupera tu contraseña" email
- **IMPORTANTE**: Copiar el link del email

### Paso 2.3: Resetear Contraseña

- Pegar el link del email en el navegador
- Deberías ir a `/reset-password/[token]`
- Ingresar nueva contraseña
- Click en "Restablecer Contraseña"

En la consola del backend deberías ver:

```
[AUTH] resetPassword successful
```

### Paso 2.4: Login con Nueva Contraseña

- URL: `http://localhost:3000/login`
- Email: `test@zonesport.com`
- Contraseña: `NewPassword123!`
- Debería funcionar ✅

## 🔍 Debugging Tips

### Ver logs en tiempo real

```bash
cd /server
npm run dev 2>&1 | grep -E "\[AUTH\]|\[EMAIL\]"
```

### Ver errores específicos

```bash
npm run dev 2>&1 | grep -i error
```

### Limpiar Base de Datos

```bash
docker-compose down
docker-compose up -d
```

Luego recrear datos de test.

### Ver requests HTTP

En las DevTools del navegador:

- Tab "Network"
- Filtrar por "fetch/xhr"
- Ver cada request y respuesta

## 📊 Estados Esperados

| Acción | Log Backend | Status |
|--------|-------------|--------|
| Registrar | `[AUTH] register - User created successfully` | ✅ |
| Welcome Email | `[EMAIL] Welcome email sent` | ✅ |
| Login Success | `[AUTH] login - Validation successful` | ✅ |
| Forgot Password | `[EMAIL] Password reset email sent` | ✅ |
| Reset Password | Backend acepta nuevo password | ✅ |

## ⚠️ Errores Comunes

### Error 401 al Login

**Síntoma**: `[AUTH] validateUser - Password valid: NO`

**Posibles Causas**:

1. Usuario anterior sin password hasheado
2. Bcrypt round incompatible
3. Encoding del password incorrecto

**Solución**:

```bash
# Reset completo de BD
docker-compose down
docker-compose up -d
# Crear nuevo usuario desde cero
```

### Error 500 al Enviar Email

**Síntoma**: `[ERROR] Error sending password reset email`

**Posibles Causas**:

1. RESEND_API_KEY no está en .env
2. API Key expirada o inválida
3. Email no verificado en Resend

**Solución**:

1. Verificar `.env` tiene `RESEND_API_KEY=re_E35oVQic_AWkimbwAALo8c4VMadrd5c24`
2. Verificar en <https://resend.com> que API key sea válida
3. Revisar Resend logs en su dashboard

### Página Olvide Contraseña Invisible

**Síntoma**: No ves los inputs

**Solución**: Ya está arreglado - tema oscuro aplicado ✅

## 📞 Contacto Resend

- Dashboard: <https://resend.com>
- API Docs: <https://resend.com/docs>
- API Key: `re_E35oVQic_AWkimbwAALo8c4VMadrd5c24`

---

**Última actualización**: 23 de enero de 2026
**Estado**: Ready for Testing ✅
