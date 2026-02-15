# ZoneSport - Guía de Deployment

Este documento contiene instrucciones para desplegar ZoneSport en Vercel y Render.

## 📋 Requisitos Previos

- Repositorio Git en GitHub/GitLab
- Cuenta en Vercel (https://vercel.com)
- Cuenta en Render (https://render.com)
- Variables de entorno configuradas

## 🚀 Deployment en Vercel (Frontend)

### Opción 1: Usando Vercel Dashboard

1. **Conectar Repositorio**
   - Ir a https://vercel.com/new
   - Seleccionar "Import Git Repository"
   - Conectar cuenta GitHub y seleccionar el repositorio ZoneSport
   - Hacer click en "Import"

2. **Configurar Proyecto**
   - **Project Name**: `zonesport` (o el que prefieras)
   - **Framework Preset**: Next.js
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **Variables de Entorno**
   - Click en "Environment Variables"
   - Agregar:
     ```
     NEXT_PUBLIC_API_URL = https://zonesport-api.render.com
     ```
   - O la URL de tu backend en producción

4. **Deploy**
   - Click en "Deploy"
   - Esperar a que se complete el build

### Opción 2: Línea de Comando

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deployar desde la raíz del proyecto
vercel --prod

# O deployar con variables de entorno
vercel --prod --env NEXT_PUBLIC_API_URL=https://tu-backend.url
```

---

## 🌐 Deployment en Render (Frontend + Backend)

### Para el Frontend

1. **Crear Nuevo Servicio Web**
   - Ir a https://dashboard.render.com/new/web
   - Conectar repositorio GitHub
   - Seleccionar `ZoneSport`
   - Click en "Connect"

2. **Configurar Build**
   - **Name**: `zonesport-frontend`
   - **Environment**: Node
   - **Region**: Frankfurt (u otra más cercana)
   - **Branch**: `main`
   - **Build Command**: 
     ```bash
     cd client && npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     cd client && npm run start
     ```
   - **Plan**: Starter (gratuito) o Pro según necesidad

3. **Agregar Variables de Entorno**
   - Click en "Environment"
   - Agregar:
     ```
     NEXT_PUBLIC_API_URL = https://zonesport-api.onrender.com
     NODE_ENV = production
     ```

4. **Deploy**
   - Click en "Create Web Service"

### Para el Backend

1. **Crear Nuevo Servicio Web**
   - Ir a https://dashboard.render.com/new/web
   - Conectar repositorio GitHub
   - Seleccionar `ZoneSport`

2. **Configurar Build**
   - **Name**: `zonesport-api`
   - **Environment**: Node
   - **Branch**: `main`
   - **Build Command**: 
     ```bash
     cd server && npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     cd server && npm run start:prod
     ```

3. **Agregar Variables de Entorno**
   - Click en "Environment"
   - Agregar todas estas variables:
     ```
     DB_HOST = localhost
     DB_PORT = 5432
     DB_NAME = zonesport_db
     DB_USERNAME = postgres
     DB_PASSWORD = tu_contraseña_segura
     JWT_SECRET = tu_secreto_jwt_muy_largo
     JWT_RESET_SECRET = tu_secreto_reset_muy_largo
     CORS_ORIGIN = https://tu-frontend.onrender.com
     NODE_ENV = production
     PORT = 3001
     ```

4. **Deploy**
   - Click en "Create Web Service"

### Para la Base de Datos

1. **Crear PostgreSQL Database**
   - Ir a https://dashboard.render.com/new/database
   - **Name**: `zonesport-db`
   - **Database**: PostgreSQL
   - **Version**: 16
   - **Region**: Frankfurt (misma que el backend)
   - Click en "Create Database"

2. **Obtener Connection String**
   - Una vez creada, copiar la "Internal Database URL"
   - Usar esta URL en la variable `DATABASE_URL` del backend

---

## 📝 Variables de Entorno Requeridas

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://zonesport-api.onrender.com
```

### Backend (.env)
```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zonesport_db
DB_USERNAME=postgres
DB_PASSWORD=contraseña_segura

# JWT
JWT_SECRET=clave_secreto_muy_larga_minimo_32_caracteres
JWT_RESET_SECRET=clave_reset_muy_larga_minimo_32_caracteres

# CORS
CORS_ORIGIN=https://zonesport.vercel.app

# Servidor
PORT=3001
NODE_ENV=production
```

---

## 🔧 Troubleshooting

### Error: "Expected unicode escape" en Vercel
- **Solución**: Verificar que no hay comillas escapadas (`\"`) en archivos `.tsx`
- Usar búsqueda grep: `grep -r '\\\"' client/app/`

### Error: "Cannot find module" en Render
- **Solución**: Asegurar que el `build` se ejecutó correctamente
- Verificar que todas las dependencias están en `package.json`
- Limpiar caché: Ir a Settings > Clear Build Cache

### Database Connection Error
- **Solución**: Verificar credenciales en variables de entorno
- Confirmar que PostgreSQL está accesible desde Render
- Para Render, usar la "Internal Database URL" en lugar de "External Database URL"

### CORS Errors
- **Solución**: Actualizar `CORS_ORIGIN` con la URL correcta del frontend
- En desarrollo: `http://localhost:3000`
- En producción: `https://tu-frontend.onrender.com`

---

## ✅ Checklist Pre-Deploy

- [ ] Todos los archivos `.tsx` sin escapes de comillas (`\"`)
- [ ] Variables de entorno configuradas en la plataforma
- [ ] Root DirectoryØ configurado correctamente (./client)
- [ ] Build Command es correcto
- [ ] Base de datos creada y accesible
- [ ] CORS configurado correctamente
- [ ] JWT secrets generados y únicos
- [ ] Rama main está actualizada con todos los cambios

---

## 🔐 Seguridad

### JWT Secrets
Generar secrets seguros:
```bash
# En terminal
openssl rand -base64 32
```

### Database Passwords
- Usar contraseñas fuertes (mínimo 16 caracteres)
- No compartir en repositorio público
- Usar variables de entorno secretas

### CORS
- Definir origen específico, nunca usar `*` en producción
- Actualizar cuando cambies dominio

---

## 📞 Soporte

Para errores específicos, revisar:
- Build logs en Vercel/Render dashboard
- Consola del navegador (F12)
- Network tab para errores de API

