# 🔒 ZoneSport - Guía de Seguridad

## Información Sensible y Variables de Entorno

### ⚠️ CRÍTICO: Nunca versionar archivos sensibles

```
❌ NUNCA hacer commit a:
  - .env (archivo con credenciales reales)
  - .env.local
  - .env.*.local
  - .env.production.local
  - *.key / *.pem (claves privadas)
  - secrets/
```

✅ **Usar .env.example** para documentar variables necesarias sin valores sensibles.

### Protección de .env

El `.gitignore` protege automáticamente:

```gitignore
.env
.env.local
.env.*.local
.env.production.local
```

### Variables de Entorno Requeridas

#### Frontend (Next.js)

```env
# .env.local o variables en Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend-api.render.com
```

**⚠️ Nota**: `NEXT_PUBLIC_*` es visible en el navegador. Nunca incluya secretos aquí.

#### Backend (NestJS)

```env
# .env (NUNCA en .env.example con valores reales)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_secure_password  # ❌ Mínimo 16 caracteres
DB_NAME=zonesport_db

JWT_SECRET=generate_with_openssl_rand_base64_32  # ❌ Mínimo 32 caracteres
JWT_RESET_SECRET=generate_with_openssl_rand_base64_32
JWT_EXPIRATION=24h

NODE_ENV=development
PORT=3001

CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Email (Resend - opcional)
RESEND_API_KEY=re_xxx_yyy_zzz  # ❌ De Resend dashboard
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_DOMAIN=yourdomain.com
```

## 🔐 Generación de Secretos Seguros

### JWT Secrets

```bash
# Generar un JWT_SECRET fuerte
openssl rand -base64 32

# Generar un JWT_RESET_SECRET fuerte
openssl rand -base64 32
```

### Contraseñas de Base de Datos

```bash
# Generar contraseña segura (mínimo 16 caracteres)
openssl rand -base64 16
```

## 🚀 Deployment en Render

1. **Crear variables de entorno en Render Dashboard**
   - Panel > Environment Variables
   - Igual a los valores de .env local
   - Usar scope `secret` para: `DB_PASSWORD`, `JWT_SECRET`, `JWT_RESET_SECRET`, `RESEND_API_KEY`

2. **Base de Datos**
   - Crear PostgreSQL en Render
   - Usar credenciales generadas por Render
   - Actualizar `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` en backend

3. **Frontend URL (CORS)**
   - `CORS_ORIGIN` = URL de tu frontend (Vercel)
   - Ejemplo: `https://zonesport.vercel.app`

## 🚀 Deployment en Vercel

1. **Configurar variables en Vercel Dashboard**
   - Project Settings > Environment Variables
   - `NEXT_PUBLIC_API_URL` = URL de backend en Render
   - Ejemplo: `https://zonesport-api.render.com`

2. **Revisar contenido público**
   - Usar `NEXT_PUBLIC_*` SOLO para variables públicas
   - Los secretos NUNCA deben ser NEXT_PUBLIC_*

## 🔍 Auditoría de Seguridad Periódica

### Verificar que no hay secretos en el repo

```bash
# Buscar patrones de secretos
git log --all --full-history -- '*.env'
git log --all --full-history -S 'JWT_SECRET' --source
git log -p --all -S 're_' -- '*.js' '*.ts'
```

### Archivos a revisar

- ✅ .env.example (NUNCA con valores reales)
- ✅ .gitignore (protege archivos sensibles)
- ✅ vercel.json (NO contiene secretos)
- ✅ render.yaml (usa variables, no valores)
- ✅ DEPLOYMENT.md (NO contiene API keys)

## 📝 Checklist Previo a Deployment

- [ ] .env local no fue commiteado (`git status` muestra limpio)
- [ ] .gitignore protege .env, .env.local, .env.*.local
- [ ] Variables en .env.example son EJEMPLOS (sin valores reales)
- [ ] JWT_SECRET y JWT_RESET_SECRET son únicos y fuertes (>32 chars)
- [ ] Contraseña de DB > 16 caracteres
- [ ] CORS_ORIGIN configurado correctamente para producción
- [ ] NEXT_PUBLIC_* contiene SOLO variables públicas
- [ ] API keys (Resend, etc.) en Render/Vercel dashboard, NO en código
- [ ] render.yaml usa variables `${VAR}` no valores hardcodeados
- [ ] vercel.json no contiene información sensible

## 🆘 Si hubo exposición de secretos

1. **Revocar inmediatamente**
   - API keys de Resend: Panel > API Keys > Revoke
   - JWT Secrets: Generar nuevos en Render/backend
   - Contraseña DB: Cambiar en Render PostgreSQL
   - Credenciales GitHub: Regenerar tokens personales

2. **Limpiar historial de Git**

   ```bash
   # Opción 1: Reescribir historio (solo en repo local sin publicar)
   git filter-branch --tree-filter 'rm -f .env' -- --all
   
   # Opción 2: Usar BFG (recomendado para repos grandes)
   bfg --replace-text passwords.txt
   
   # Opción 3: Si ya está en GitHub
   # - Avisare al equipo
   # - Cambiar todos los secretos
   # - Considerar clonar repo sin historio
   ```

3. **Auditar cambios recientes**

   ```bash
   git log --oneline -20  # Ver commits recientes
   git show <commit-hash>  # Revisar cambios
   ```

## 📚 Recursos Adicionales

- [OWASP - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [NestJS - Environment Configuration](https://docs.nestjs.com/techniques/configuration)
- [Next.js - Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Última actualización**: 15 de febrero de 2026
**Responsable**: Miguel Estrada López
