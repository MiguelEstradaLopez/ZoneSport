# 🎯 Roadmap Funcional - ZoneSport 100%

> Análisis completo de features implementadas vs. features faltantes para alcanzar funcionalidad completa

---

## 📊 Estado Actual de la App

### ✅ IMPLEMENTADO (Backend)

| Módulo | Features | Estado |
|--------|----------|--------|
| **Auth** | Registro, Login, Reset Contraseña | ✅ Completo |
| **Users** | CRUD Usuarios, Búsqueda | ✅ Completo |
| **Sports** | Catálogo de deportes | ✅ Base |
| **Events** | CRUD Eventos/Torneos | ✅ Base |
| **Matches** | CRUD Partidos | ✅ Base |
| **Classifications** | Tablas de posiciones | ✅ Base |
| **News** | Blog/Noticias | ✅ Base |
| **Email** | Resend API integrada | ✅ Configurado |

### ✅ IMPLEMENTADO (Frontend)

| Página | Features | Estado |
|--------|----------|--------|
| **Login/Registrar** | Formularios autenticación | ✅ Funcional |
| **Perfil** | Ver datos usuario | ✅ Base |
| **Eventos** | Listar eventos | ✅ Base |
| **Crear Evento** | Formulario eventos | ✅ Base |
| **Clasificación** | Ver tablas | ✅ Base |
| **Noticias** | Listar posts | ✅ Base |

### ⚠️ PARCIALMENTE IMPLEMENTADO

| Feature | Detalles | Falta |
|---------|----------|-------|
| **Posts de Usuarios** | Módulo exists | Almacenamiento de imágenes, validaciones |
| **Invitaciones** | Lógica básica | Notificaciones, interfaz |
| **Integración Google** | No iniciada | Calendario + Maps |

---

## 🚀 FEATURES SOLICITADAS - Prioridad Alta

### 1️⃣ Posts/Actualizaciones de Usuarios

**Lo que necesita:**

```
✅ Backend:
- Entidad Post con campos:
  - id (PK)
  - userId (FK)
  - content (varchar 250)
  - images (JSON array, 1-2 imágenes)
  - createdAt, updatedAt
  - likes, comments count
  
- Endpoints:
  - POST /posts (crear)
  - GET /posts (listar timeline)
  - GET /posts/:id (detalle)
  - DELETE /posts/:id (eliminar propio)
  - PUT /posts/:id/like (dar like)

✅ Frontend:
- Componente de creador de posts (textarea 250 chars)
- Upload de imágenes (máx 2)
- Feed de posts
- Card de post con likes/comentarios

✅ Infraestructura:
- Servicio de almacenamiento de imágenes:
  - AWS S3 O
  - Cloudinary O
  - Firebase Storage
```

---

### 2️⃣ Creación y Gestión de Torneos

**Lo que necesita:**

```
✅ Backend (Expandir Events):
- Campos adicionales en Event:
  - sport (FK a Sports)
  - startDate, endDate
  - location (coordenadas)
  - maxParticipants
  - format (individual/equipos)
  - bracket (64, 32, 16, 8, eliminación)
  - status (creado, en curso, finalizado)
  - createdBy (FK Users)

- Endpoints:
  - POST /events (crear torneo)
  - GET /events/:id/bracket (árbol de torneo)
  - PATCH /events/:id (actualizar)
  - POST /events/:id/join (inscribirse)
  - DELETE /events/:id/join (retirarse)
  - GET /events/:id/participants (listado)

✅ Frontend:
- Formulario creación torneo (tipo, sport, fechas, ubicación)
- Vista del bracket/árbol de torneo
- Panel de gestión para organizador
- Sistema de inscripción

✅ Lógica:
- Generación automática de bracket
- Cálculo de emparejamientos
- Validación de disponibilidad
```

---

### 3️⃣ Sistema de Invitaciones

**Lo que necesita:**

```
✅ Backend (Nueva entidad):
- Entidad Invitation:
  - id (PK)
  - senderId (FK Users)
  - recipientId (FK Users)
  - eventId (FK Events) - opcional
  - type (friend/event/team)
  - status (pending/accepted/rejected)
  - createdAt, expiresAt

- Endpoints:
  - POST /invitations (enviar invitación)
  - GET /invitations (listar pendientes)
  - PATCH /invitations/:id/accept (aceptar)
  - PATCH /invitations/:id/reject (rechazar)
  - DELETE /invitations/:id (cancelar)

✅ Frontend:
- Sistema de notificaciones en tiempo real (WebSocket)
- Bell icon con contador
- Panel de invitaciones pendientes
- Opción para invitar desde evento

✅ Notificaciones:
- Email cuando recibe invitación
- Push notifications (opcional)
- In-app notifications
```

---

### 4️⃣ Integración Google Calendar

**Lo que necesita:**

```
✅ Backend:
- OAuth2 con Google:
  - Guardar refresh_token
  - Crear evento en calendario del usuario
  
- Endpoints:
  - POST /calendar/auth (iniciar OAuth)
  - GET /calendar/callback (recibir código)
  - POST /events/:id/sync-calendar (sincronizar)
  - GET /user/calendar/events (listar)

- Librería: google-auth-library-nodejs

✅ Frontend:
- Botón "Conectar Google Calendar"
- Checkbox "Agregar a mi calendario" en torneo
- Vista de calendario integrada

✅ Lógica:
- Crear evento en Google Cal cuando cree torneo
- Actualizar si cambian fechas
- Recordatorios automáticos
```

---

### 5️⃣ Integración Google Maps

**Lo que necesita:**

```
✅ Backend:
- Guardar ubicación en Events:
  - latitude, longitude
  - address (string)
  - venue (nombre lugar)

✅ Frontend:
- Componente mapa (react-google-maps)
- Input de ubicación con autocompletado
- Mapa en detalle de evento
- Vista de eventos cercanos en mapa

✅ Lógica:
- Buscar ubicación por dirección
- Mostrar ruta desde ubicación del usuario
- Filtrar eventos por radio de distancia
```

---

### 6️⃣ Tablas de Clasificación Avanzadas

**Lo que necesita:**

```
✅ Backend (Expandir Classifications):
- Campos:
  - userId (FK)
  - eventId (FK)
  - position (1, 2, 3...)
  - pointsWon
  - pointsAgainst
  - differencial
  - wins
  - losses
  - draws

- Endpoints:
  - GET /events/:id/classifications (tabla)
  - GET /events/:id/bracket (árbol eliminación)
  - GET /events/:id/standings (posiciones)
  
- Lógica:
  - Actualizar automáticamente en POST /matches/:id/result
  - Ordenar por puntos, diferencial, H2H

✅ Frontend:
- Tabla dinámica con columnas ordenables
- Vista de árbol de eliminación
- Gráficos de progresión del usuario
- Historial de enfrentamientos (H2H)
```

---

## 🔧 FEATURES FALTANTES - Análisis Adicional

### Nivel 1: CRÍTICO (MVP)

| Feature | Descripción | Esfuerzo | Prioridad |
|---------|------------|----------|-----------|
| **File Upload Service** | Sistema para guardar imágenes | Alto | 🔴 CRÍTICO |
| **Notificaciones Real-time** | WebSocket para invitaciones | Medio | 🔴 CRÍTICO |
| **OAuth Google** | Conectar con Google | Medio | 🔴 CRÍTICO |
| **Payment System** | Pagos para torneos premium | Alto | 🟡 MEDIO |
| **Search & Filter** | Buscar torneos por deporte/fecha | Bajo | 🟡 MEDIO |

### Nivel 2: IMPORTANTE

| Feature | Descripción | Esfuerzo | Prioridad |
|---------|------------|----------|-----------|
| **Comments en Posts** | Sistema de comentarios | Medio | 🟡 MEDIO |
| **Direct Messaging** | Chat entre usuarios | Medio | 🟡 MEDIO |
| **User Ratings** | Sistema de ratings/reviews | Bajo | 🟠 BAJO |
| **Achievement Badges** | Badges y logros | Bajo | 🟠 BAJO |
| **Mobile App** | App nativa (React Native) | Muy Alto | 🟠 BAJO |

### Nivel 3: ENHANCEMENTS

| Feature | Descripción | Esfuerzo | Prioridad |
|---------|------------|----------|-----------|
| **Dark Mode** | Tema oscuro | Bajo | 🟢 NICE-TO-HAVE |
| **i18n (Internacionalización)** | Multi-idioma | Medio | 🟢 NICE-TO-HAVE |
| **Analytics** | Dashboard de estadísticas | Medio | 🟢 NICE-TO-HAVE |
| **Admin Panel** | Panel de administración | Medio | 🟢 NICE-TO-HAVE |
| **API Rate Limiting** | Protección de abuso | Bajo | 🟢 NICE-TO-HAVE |

---

## 🛠️ Stack Recomendado - Nuevas Integraciones

### Almacenamiento de Imágenes

```typescript
// Opción 1: Cloudinary (Recomendado para MVP)
npm install cloudinary next-cloudinary
// Ventajas: Fácil de integrar, transformaciones automáticas

// Opción 2: AWS S3
npm install aws-sdk
// Ventajas: Escalable, control total

// Opción 3: Firebase Storage
npm install firebase
// Ventajas: Real-time, integrado con Auth
```

### WebSocket (Notificaciones Real-time)

```typescript
// Backend
npm install @nestjs/websockets socket.io

// Frontend  
npm install socket.io-client
```

### Google Integrations

```typescript
// OAuth + Calendar
npm install google-auth-library @googleapis/calendar

// Maps
npm install @react-google-maps/api
```

### Pagos (Si aplica)

```typescript
// Stripe (Recomendado para Latam)
npm install stripe

// O MercadoPago (Mejor para Latam)
npm install mercadopago
```

---

## 📋 Plan de Implementación Sugerido

### Fase 1 (2-3 semanas) - MVP Completo

```
1. ✅ Sistema de Posts (imágenes + validación)
2. ✅ Invitaciones (básico sin notificaciones)
3. ✅ Mejorar formulario Torneos
```

### Fase 2 (2 semanas) - Integraciones

```
4. ✅ Notificaciones Real-time (WebSocket)
5. ✅ Google Calendar
6. ✅ Google Maps
```

### Fase 3 (1-2 semanas) - Polish

```
7. ✅ Tablas avanzadas con gráficos
8. ✅ Sistema de comentarios en posts
9. ✅ Búsqueda y filtros
```

### Fase 4 (Futuro) - Monetización

```
10. ✅ Sistema de pagos
11. ✅ Premium features
12. ✅ Admin panel
```

---

## 📐 Modelos de Datos Faltantes

### 1. Post (Entidad)

```typescript
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column('varchar', { length: 250 })
  content: string;

  @Column('simple-array', { nullable: true })
  images: string[]; // URLs de Cloudinary/S3

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. Invitation (Entidad)

```typescript
@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  recipient: User;

  @ManyToOne(() => Event, { nullable: true })
  event?: Event;

  @Column({ type: 'enum', enum: ['friend', 'event', 'team'] })
  type: 'friend' | 'event' | 'team';

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date; // 30 días
}
```

### 3. Comment (Entidad)

```typescript
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Post, { cascade: true, onDelete: 'CASCADE' })
  post: Post;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  likesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 4. Actualizar Event (Entidad)

```typescript
// Agregar a event.entity.ts:

@Column('double', { nullable: true })
latitude: number;

@Column('double', { nullable: true })
longitude: number;

@Column({ nullable: true })
address: string;

@Column({ nullable: true })
venue: string;

@Column('int')
maxParticipants: number;

@Column({
  type: 'enum',
  enum: ['individual', 'equipos'],
  default: 'individual'
})
format: 'individual' | 'equipos';

@Column({
  type: 'enum',
  enum: ['creado', 'en_curso', 'finalizado'],
  default: 'creado'
})
status: 'creado' | 'en_curso' | 'finalizado';

@ManyToOne(() => User)
createdBy: User;

@ManyToOne(() => Sport, { eager: true })
sport: Sport;
```

---

## 🔒 Consideraciones de Seguridad

- ✅ Validar tamaño de imágenes (< 5MB)
- ✅ Validar tipo de archivo (solo JPEG/PNG)
- ✅ Sanitizar contenido de posts
- ✅ Rate limiting en upload de imágenes
- ✅ Validar OAuth tokens de Google
- ✅ CORS configurado para Google APIs
- ✅ Encriptar tokens refresh de Google

---

## 📱 Testing Sugerido

```bash
# Tests a agregar:

# 1. Posts
npm test -- posts.service.spec
npm test -- posts.controller.spec

# 2. Invitations  
npm test -- invitations.service.spec

# 3. File Upload
npm test -- file-upload.service.spec

# 4. Google OAuth
npm test -- google-oauth.service.spec

# E2E
npm run test:e2e
```

---

## 📊 Estimación de Esfuerzo Total

| Feature | Backend | Frontend | Testing | Total |
|---------|---------|----------|---------|-------|
| Posts | 8h | 12h | 4h | **24h** |
| Invitaciones | 6h | 8h | 3h | **17h** |
| Google Calendar | 10h | 6h | 3h | **19h** |
| Google Maps | 4h | 10h | 2h | **16h** |
| Clasificaciones Avanzadas | 12h | 8h | 4h | **24h** |
| Comments en Posts | 6h | 8h | 2h | **16h** |
| **TOTAL FASE 1** | **36h** | **40h** | **14h** | **~100h** |
| **TOTAL COMPLETO** | **60h** | **70h** | **25h** | **~155h** |

---

## ✨ Conclusión

**Para que ZoneSport sea 100% funcional, necesitas:**

🔴 **CRÍTICO (Sin esto no funciona como app de torneos):**

1. Sistema de Posts con imágenes
2. Sistema de Invitaciones con notificaciones
3. Mejoras en creación/gestión de Torneos
4. Tablas de clasificación avanzadas
5. Google Calendar + Google Maps

🟡 **IMPORTANTE:**
6. Comments/Menciones
7. Chat directo entre usuarios
8. Búsqueda avanzada y filtros
9. Sistema de ratings

🟠 **NICE-TO-HAVE:**
10. Gamificación (badges, logros)
11. Mobile App
12. Sistema de pagos premium
13. Admin panel

**Esfuerzo estimado:** 100-150 horas (3-4 semanas con desarrollador full-time)

---

**Última actualización:** 23 de enero de 2026  
**Versión:** 1.0
