# 🔧 Variables de Entorno - ZoneSport

Referencia completa de todas las variables de entorno necesarias para ejecutar el proyecto.

---

## 📋 Archivo .env (Desarrollo Local)

**Ubicación**: `server/.env`

Este archivo contiene credenciales reales para tu máquina local. **NUNCA debe commitirse a Git**.

```env
# ============================================
# BASE DE DATOS (PostgreSQL)
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=UserName
DB_PASSWORD=ExamplePassword
DB_NAME=ExampleName_DB

# ============================================
# AUTENTICACIÓN (JWT)
# ============================================
JWT_SECRET=miki_secreto_2026_antioquia
JWT_RESET_SECRET=miki_reset_secreto_2026_antioquia

# ============================================
# EMAIL (SMTP)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=app-specific-password
SMTP_FROM=noreply@zonesport.com

# ============================================
# APLICACIÓN
# ============================================
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## 📄 Archivo .env.example (Plantilla)

**Ubicación**: `server/.env.example`

Este archivo es una **plantilla** que SÍ debe commitirse a Git. Contiene nombres de variables con valores genéricos.

```env
# ============================================
# BASE DE DATOS (PostgreSQL)
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres_user
DB_PASSWORD=secure_password_here
DB_NAME=zonesport_db

# ============================================
# AUTENTICACIÓN (JWT)
# ============================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_RESET_SECRET=your-secret-reset-token-key-change-this-in-production

# ============================================
# EMAIL (SMTP)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM=noreply@yourdomain.com

# ============================================
# APLICACIÓN
# ============================================
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## 📖 Descripción de Variables

### Base de Datos

| Variable | Descripción | Ejemplo | Requerido |
|----------|-------------|---------|-----------|
| `DB_HOST` | Host del servidor PostgreSQL | `localhost` | ✅ |
| `DB_PORT` | Puerto de PostgreSQL | `5432` | ✅ |
| `DB_USERNAME` | Usuario de BD | `miki_user` | ✅ |
| `DB_PASSWORD` | Contraseña de BD | `7667` | ✅ |
| `DB_NAME` | Nombre de la base de datos | `zonesport_db` | ✅ |

### Autenticación JWT

| Variable | Descripción | Formato | Requerido |
|----------|-------------|---------|-----------|
| `JWT_SECRET` | Clave para firmar JWT (login) | 32+ caracteres | ✅ |
| `JWT_RESET_SECRET` | Clave para JWT reset password | 32+ caracteres | ✅ |

**Generar secretos seguros**:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Email SMTP

| Variable | Descripción | Ejemplo | Requerido |
|----------|-------------|---------|-----------|
| `SMTP_HOST` | Host del servidor SMTP | `smtp.gmail.com` | ✅ |
| `SMTP_PORT` | Puerto SMTP | `587` | ✅ |
| `SMTP_SECURE` | Usar TLS/SSL | `false` (587) o `true` (465) | ✅ |
| `SMTP_USER` | Usuario/Email SMTP | `usuario@gmail.com` | ✅ |
| `SMTP_PASSWORD` | Contraseña SMTP | `app-password` | ✅ |
| `SMTP_FROM` | Email "desde" | `noreply@zonesport.com` | ✅ |

### Aplicación

| Variable | Descripción | Valor | Requerido |
|----------|-------------|-------|-----------|
| `NODE_ENV` | Entorno | `development` o `production` | ✅ |
| `PORT` | Puerto del servidor | `3001` | ✅ |
| `FRONTEND_URL` | URL del frontend | `http://localhost:3000` | ✅ |

---

## 🔄 Configurar por Entorno

### Desarrollo Local

```env
NODE_ENV=development
DB_HOST=localhost
DB_PASSWORD=7667
JWT_SECRET=secreto-local-cualquiera
SMTP_HOST=smtp.gmail.com
CORS_ORIGIN=* (permisivo)
LOGGING=true
```

**Características**:

- Base de datos local
- JWT con secreto simple
- CORS permisivo
- Logging habilitado
- Email opcional (puede usar valores dummy)

### Staging

```env
NODE_ENV=staging
DB_HOST=staging-db.miservidor.com
DB_PASSWORD=contraseña-staging-segura
JWT_SECRET=jwt-staging-seguro-32-caracteres
SMTP_HOST=smtp.staging.proveedor.com
CORS_ORIGIN=https://staging.midominio.com
LOGGING=limited
```

### Producción

```env
NODE_ENV=production
DB_HOST=db.proton.hosting
DB_PASSWORD=contraseña-produccion-altamente-segura
JWT_SECRET=jwt-produccion-criptografico-32-caracteres
SMTP_HOST=smtp.proton.hosting
SMTP_USER=email-produccion@midominio.com
CORS_ORIGIN=https://midominio.com
LOGGING=errors-only
```

---

## 📧 Configurar Email por Proveedor

### Gmail (Recomendado para Desarrollo)

1. Habilitar 2FA en <https://myaccount.google.com/>
2. Ir a <https://myaccount.google.com/apppasswords>
3. Seleccionar "Mail" y "Windows"
4. Copiar contraseña generada

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=contraseña-app-generada
SMTP_FROM=tu-email@gmail.com
```

### Mailtrap (Para Testing)

1. Crear cuenta en <https://mailtrap.io>
2. Crear proyecto
3. Copiar credenciales SMTP

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=usuario-mailtrap
SMTP_PASSWORD=password-mailtrap
SMTP_FROM=info@example.com
```

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=tu-api-key-sendgrid
SMTP_FROM=noreply@tudominio.com
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@tudominio.com
SMTP_PASSWORD=password-mailgun
SMTP_FROM=noreply@tudominio.com
```

---

## ✅ Checklist de Configuración

### Antes de Iniciar Frontend

- [ ] Backend corriendo en localhost:3001
- [ ] Base de datos PostgreSQL corriendo
- [ ] `server/.env` creado desde `.env.example`
- [ ] Valores de `DB_*` son correctos

### Antes de Iniciar Backend

- [ ] `npm install` ejecutado en `/server`
- [ ] `docker-compose up -d` ejecutado (si DB es local)
- [ ] `server/.env` existe y tiene valores válidos
- [ ] Puerto 3001 disponible

### Antes de Producción

- [ ] Todas las variables tienen valores reales
- [ ] JWT_SECRET tiene 32+ caracteres aleatorios
- [ ] DB_PASSWORD es contraseña fuerte
- [ ] SMTP configurado correctamente
- [ ] NODE_ENV=production
- [ ] `.env` NO está en Git
- [ ] `.env.example` SÍ está en Git
- [ ] `.gitignore` contiene `.env`

---

## 🔒 Seguridad

### ❌ NUNCA

```bash
# ❌ NO commitar .env
git add .env
git commit -m "Add env"

# ❌ NO usar contraseñas débiles
DB_PASSWORD=1234
JWT_SECRET=secret

# ❌ NO hardcodear credenciales
const password = '7667';
```

### ✅ SIEMPRE

```bash
# ✅ Usar .env.example
cp .env.example .env

# ✅ Generar secretos seguros
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ✅ Usar process.env en el código
const dbPassword = process.env.DB_PASSWORD;
```

---

## 🚀 Desplegar en Proton Hosting

1. **Subir código** a GitHub (sin `.env`)
2. **Conectar repo** en panel de Proton
3. **Ir a Environment Variables** en Proton
4. **Agregar variables**:

   ```
   DB_HOST = db.proton.hosting
   DB_PASSWORD = contraseña-proton
   JWT_SECRET = secreto-seguro-32-chars
   SMTP_USER = email@dominio.com
   SMTP_PASSWORD = app-password
   NODE_ENV = production
   ```

5. **Deploy automático** - Proton inyecta variables
6. **Verificar** que app inicia correctamente

**Ventaja**: Mismo código, diferentes variables por entorno.

---

## 🔍 Verificar Configuración

```bash
# Listar variables de entorno cargadas
node -e "console.log(process.env)" | grep DB_

# Verificar que .env está protegido
git check-ignore .env
# Salida esperada: .env

# Verificar que .env.example está en Git
git ls-files | grep env.example
# Salida esperada: server/.env.example
```

---

## 📞 Soporte

Si tienes variables que no sabes cómo configurar, revisa la guía de desarrollo o crea un issue en GitHub.

**Última actualización**: 23 de enero de 2026
