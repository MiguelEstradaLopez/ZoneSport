# Convención de Archivos de Ambiente (.env) - ZoneSport

## ⚠️ REGLA FUNDAMENTAL

**TODO lo inseguro y sensible debe estar SOLO en .env**:
- ✅ API Keys (Resend, etc.)
- ✅ Contraseñas (Database, usuarios admin, etc.)
- ✅ Puertos (DATABASE_PORT, SERVER_PORT, etc.)
- ✅ URLs privadas
- ✅ Secretos JWT
- ✅ Connection strings
- ✅ Tokens de autenticación
- ✅ Configuración sensible

**Nunca comitear .env a Git** (está en .gitignore)

---

## 📍 Estructura de .env

```
PROYECTO_ROOT/
├── .env                    ← ÚNICO archivo con secretos (NO commitear)
├── .env.example            ← Documentación públicasin valores
├── .gitignore              ← Protege .env de ser versionado
├── servidor/
│   └── src/
│       └── app.module.ts   ← Lee de: '../../../.env'
└── cliente/
    └── app/
        └── layout.tsx      ← USA: process.env.NEXT_PUBLIC_*
```

### `.env` (PRIVADO - NO COMMITEAR)
```
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=miki_user
DATABASE_PASSWORD=7667
DATABASE_NAME=zonesport_db
DATABASE_URL=postgresql://miki_user:7667@localhost:5432/zonesport_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=24h

# Server
SERVER_PORT=3001
NODE_ENV=development

# CORS & Frontend
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# Email (opcional)
RESEND_API_KEY=your-resend-api-key-here
SENDER_EMAIL=noreply@zonesport.com
```

### `.env.example` (PÚBLICO - COMMITEAR)
```
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=zonesport_user
DATABASE_PASSWORD=your_secure_password_here
DATABASE_NAME=zonesport_db
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=generate_with_openssl_rand_-base64_32
JWT_EXPIRATION=24h

# Server
SERVER_PORT=3001
NODE_ENV=development

# CORS & Frontend
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# Email (opcional)
RESEND_API_KEY=optional_resend_api_key
SENDER_EMAIL=noreply@yourdomain.com
```

---

## 🔐 Diferencia entre Variables

### Variables Sensibles (en .env)
```typescript
// ❌ NUNCA en código fuente
const dbPassword = "7667"; // ¡INSEGURO!

// ✅ SIEMPRE en .env
const dbPassword = process.env.DATABASE_PASSWORD;
```

### Variables Públicas (NEXT_PUBLIC_*)
```typescript
// SOLO variables que puede ver el navegador del cliente
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001" // ✅ OK público

// ❌ NUNCA públicas
process.env.NEXT_PUBLIC_DATABASE_PASSWORD // ¡NUNCA!
```

---

## ✅ Verificación Antes de Cada Commit

Antes de hacer `git push`, verificar:

```bash
# 1. Confirmar que .env está en .gitignore
grep -E "^\.env" .gitignore

# 2. Verificar que .env NO está staged
git status | grep ".env"
# Resultado esperado: NADA (no debe aparecer)

# 3. Buscar secretos en el código
git diff --cached | grep -E "password|secret|api.key|token"
# Resultado esperado: NADA (no debe encontrar secretos)

# 4. Buscar valores hardcodeados
grep -r "DATABASE_PASSWORD=" server/src/ client/app/
# Resultado esperado: NADA (usar process.env)
```

---

## 🚀 Flujo de Desarrollo Local

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/MiguelEstradaLopez/ZoneSport.git
   cd ZoneSport
   ```

2. **Crear .env local**
   ```bash
   cp .env.example .env
   # Editar .env con tus valores reales
   nano .env
   ```

3. **Nunca commitear .env**
   ```bash
   git add -A
   git status  # Verificar que .env NO está en la lista
   git commit -m "..."
   ```

---

## 🌍 Flujo de Deployment (Render, Vercel)

### Render Backend
1. Variables en **Render Dashboard** > Environment
2. NO subir archivo .env a producción
3. Render reemplaza automáticamente `process.env.*`

### Vercel Frontend
1. Variables en **Vercel Dashboard** > Settings > Environment Variables
2. Automáticamente disponibles como `process.env.NEXT_PUBLIC_*`
3. Frontend solo accede a variables públicas

---

## 🛡️ Checklist de Seguridad

- [ ] .env está en .gitignore
- [ ] .env.example está en Git (SIN valores reales)
- [ ] Solo un .env en la raíz
- [ ] No hay variables hardcodeadas en código
- [ ] Variables sensibles usan `process.env.*`
- [ ] Variables públicas tienen prefijo `NEXT_PUBLIC_`
- [ ] Git history limpio (sin secretos anteriores)
- [ ] Cada desarrollador tiene su propia copia de .env

---

## 📞 Referencia Rápida

| Archivo | Ubicación | Commitear | Propósito |
|---------|-----------|-----------|-----------|
| `.env` | Raíz | ❌ NO | Valores reales secretos |
| `.env.example` | Raíz | ✅ SÍ | Documentación pública |
| `.env.local` | Cliente (opcional) | ❌ NO | Overrides locales |
| `.gitignore` | Raíz | ✅ SÍ | Protección de secretos |

---

**ÚLTIMA ACTUALIZACIÓN**: 15 de febrero de 2026  
**TODOS LOS DESARROLLADORES DEBEN LEER ESTE DOCUMENTO**
