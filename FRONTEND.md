# 💻 Documentación Frontend - ZoneSport

Guía completa para entender, trabajar y desarrollar el frontend de ZoneSport.

---

## 📋 Tabla de Contenidos

1. [Introducción](#-introducción)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Tecnologías](#-tecnologías)
4. [Sistema de Estilos](#-sistema-de-estilos)
5. [Páginas Principales](#-páginas-principales)
6. [Componentes](#-componentes)
7. [Servicios HTTP](#-servicios-http)
8. [Cómo Contribuir](#-cómo-contribuir)

---

## 📖 Introducción

**ZoneSport Frontend** es la interfaz visual - lo que el usuario ve y con lo que interactúa.

**Está construido con:**
- **Next.js** - Framework React que facilita crear sitios web rápidos
- **React** - Biblioteca para hacer componentes visuales reutilizables
- **Tailwind CSS** - Forma moderna de aplicar estilos
- **TypeScript** - JavaScript pero con validación de tipos (menos errores)

### Flujo Visual (Lo que sucede cuando un usuario visita)

```
1. Usuario abre http://localhost:3000
   ↓
2. Browser descarga HTML, CSS, JavaScript
   ↓
3. React renderiza la página usando componentes
   ↓
4. Usuario ve: Navbar + Home + Footer
   ↓
5. Usuario hace clic en "Crear Evento"
   ↓
6. React muestra el formulario (SIN recargar)
   ↓
7. Usuario llena y presiona "Guardar"
   ↓
8. Frontend envía datos al Backend
   ↓
9. Backend guarda y devuelve respuesta
   ↓
10. React actualiza página automáticamente
```

**Ventaja:** Sin recargas completas = rápidísimo y suave.

---

## 🎯 Características Principales

- ✅ **Responsive** - Funciona en desktop, tablet, móvil
- ✅ **Dark mode** - Tema oscuro optimizado
- ✅ **Autenticación JWT** - Segura y moderna
- ✅ **Etiquetas semánticas** - HTML5 válido
- ✅ **Sistema de estilos** - Clases reutilizables
- ✅ **Componentes** - Código organizado y mantenible

---

## 🏗️ Estructura del Proyecto

```
client/
├── app/                          # Rutas y páginas
│   ├── page.tsx                  # Home (/)
│   ├── layout.tsx                # Layout global
│   ├── globals.css               # Estilos globales
│   │
│   ├── login/                    # Página de login
│   │   └── page.tsx
│   │
│   ├── registrar/                # Registro de usuarios
│   │   └── page.tsx
│   │
│   ├── eventos/                  # Gestión de eventos
│   │   ├── page.tsx              # Listado de eventos
│   │   └── [id]/
│   │       └── page.tsx          # Detalle del evento
│   │
│   ├── crear-evento/             # Formulario crear evento
│   │   └── page.tsx
│   │
│   ├── clasificacion/            # Tablas de posiciones
│   │   └── page.tsx
│   │
│   ├── noticias/                 # Blog de noticias
│   │   └── page.tsx
│   │
│   ├── perfil/                   # Perfil del usuario
│   │   └── page.tsx
│   │
│   ├── olvide-contrasena/        # Recuperar contraseña
│   │   └── page.tsx
│   │
│   └── reset-password/           # Resetear contraseña
│       └── [token]/
│           └── page.tsx
│
├── components/                   # Componentes reutilizables
│   └── layout/
│       └── Navbar.tsx            # Barra de navegación
│
├── services/                     # Servicios HTTP
│   ├── api.ts                    # Cliente HTTP base
│   ├── authService.ts            # Autenticación
│   ├── eventsService.ts          # Eventos
│   ├── matchesService.ts         # Partidos
│   ├── sportsService.ts          # Deportes
│   ├── classificationsService.ts # Clasificaciones
│   ├── usersService.ts           # Usuarios
│   └── newsService.ts            # Noticias
│
├── public/                       # Archivos estáticos
│   └── images/
│
├── globals.d.ts                  # Tipos globales
├── next.config.ts                # Configuración Next.js
├── tailwind.config.ts            # Configuración Tailwind
├── tsconfig.json                 # Configuración TypeScript
├── package.json
└── eslint.config.mjs             # Configuración ESLint
```

---

## 🚀 Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Next.js** | 16+ | Framework React fullstack |
| **React** | 19 | Biblioteca de UI |
| **TypeScript** | 5+ | Tipado estático |
| **Tailwind CSS** | 4+ | Utility-first CSS |
| **Lucide React** | Latest | Iconos |
| **Axios** | 1.13+ | Cliente HTTP |
| **React Hook Form** | 7.70+ | Gestión de formularios |
| **Zod** | 4.3+ | Validación de esquemas |

---

## 🎨 Sistema de Estilos

### Paleta de Colores

La aplicación usa un **sistema de colores corporativos centralizado**:

```typescript
// tailwind.config.ts
colors: {
  'zs': {
    'dark': '#0f172a',           // Fondo principal
    'darker': '#0a0f1a',         // Fondos secundarios
    'blue': '#0d47a1',           // Títulos (AZUL PROFUNDO)
    'blue-light': '#1e88e5',     // Hover acciones
    'green': '#7cb342',          // Enlaces (VERDE LIMA)
    'green-light': '#9ccc65',    // Hover enlaces
    'text': '#ffffff',           // Texto principal
    'text-secondary': '#b0b0b0', // Texto secundario
    'border': '#1e293b',         // Bordes
  }
}
```

### Tipografías (Google Fonts)

El proyecto utiliza **tres fuentes Google Fonts** para máxima legibilidad y consistencia:

| Fuente | Uso | Pesos | Ejemplo |
|--------|-----|-------|---------|
| **Poppins** | Todos los títulos (h1-h6) | 400, 500, 600, 700 | `<h1>Eventos Deportivos</h1>` |
| **JetBrains Mono** | Texto de cuerpo y párrafos | 400, 500, 600 | `<p>Descripción...</p>` |
| **Outfit** | Enlaces y elementos cliqueables | 400, 500, 600, 700 | `<a href="#">Recuperar contraseña</a>` |

Importadas automáticamente en `app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap');

:root {
  --font-titles: 'Poppins', sans-serif;
  --font-body: 'JetBrains Mono', monospace;
  --font-links: 'Outfit', sans-serif;
}
```

### Variables CSS

Disponibles en `app/globals.css`:

```css
:root {
  /* Colores */
  --zs-dark: #0f172a;
  --zs-darker: #0a0f1a;
  --zs-blue: #0d47a1;
  --zs-blue-light: #1e88e5;
  --zs-green: #7cb342;
  --zs-green-light: #9ccc65;
  --zs-text: #ffffff;
  --zs-text-secondary: #b0b0b0;
  --zs-border: #1e293b;

  /* Fonts */
  --font-titles: 'Poppins', sans-serif;
  --font-body: 'JetBrains Mono', monospace;
  --font-links: 'Outfit', sans-serif;
}

/* Uso en CSS personalizado */
.custom-element {
  background: var(--zs-dark);
  color: var(--zs-text);
  font-family: var(--font-body);
}
```

---

## 📋 Clases CSS Reutilizables (Guía Completa)

Se ha creado un **sistema de clases CSS legible y mantenible** para simplificar el desarrollo. En lugar de usar largas cadenas de Tailwind confusas, **usamos clases semánticas** definidas en `globals.css`.

**Comparación:**
```tsx
// ANTES (Confuso) ❌
className="fixed top-0 w-full bg-zs-dark/95 backdrop-blur-md border-b border-zs-border z-50"

// AHORA (Legible) ✅
className="navbar"
```

### Layout & Contenedores

#### `.navbar` - Barra de navegación fija
```tsx
<nav className="navbar">
  <div className="navbar-container">
    <div className="navbar-content">
      {/* Logo y navegación */}
    </div>
  </div>
</nav>
```

#### `.page-container` - Contenedor principal de página
```tsx
<main className="page-container">
  {/* Contenido con pt-16 para navbar fijo */}
</main>
```

#### `.content-wrapper` - Envolvente de contenido centrado
```tsx
<div className="content-wrapper">
  {/* Max 7xl centrado con padding */}
</div>
```

#### `.card` - Contenedor de card/caja reutilizable
```tsx
<div className="card">
  <div className="card-header">Encabezado</div>
  <div className="card-body">Contenido</div>
  <div className="card-footer">Pie</div>
</div>
```

### Tipografía

Usa **etiquetas HTML semánticas** (`<h1>`, `<h2>`, `<p>`, etc.):

| Elemento | Clase | Uso |
|----------|-------|-----|
| `<h1>` | Títulos principales (Poppins, Azul) | Página principal |
| `<h2>` | Títulos secundarios (Poppins, Azul) | Secciones |
| `<h3>` | Subtítulos (Poppins, Azul) | Subsecciones |
| `<h4>` | Títulos pequeños (Poppins) | Información |
| `<p>` o `.body-text` | Párrafos normales (JetBrains Mono) | Contenido |
| `.text-muted` | Texto secundario/gris (JetBrains Mono) | Metadatos |
| `.text-small` | Texto pequeño/gris (JetBrains Mono) | Labels |

**Ejemplos:**
```tsx
<h1>Título Principal</h1>
<p className="body-text">Párrafo normal</p>
<p className="text-muted">Texto secundario</p>
```

### Botones

Clase base: `.btn` (proporciona padding, transiciones, etc.)

#### Variantes de color:
- `.btn-primary` - Verde (acciones principales)
- `.btn-secondary` - Azul (acciones alternativas)
- `.btn-outline` - Transparente (acciones menos importantes)

#### Tamaños:
- `.btn-sm` - Pequeño (para espacios reducidos)
- `.btn` - Normal (default)

**Ejemplos:**
```tsx
{/* Botón verde principal */}
<button className="btn btn-primary">Enviar</button>

{/* Botón azul alternativo */}
<button className="btn btn-secondary">Cancelar</button>

{/* Botón outline pequeño */}
<button className="btn btn-outline btn-sm">Más info</button>
```

### Enlaces (Links)

Todos los enlaces usan **Outfit** para máxima legibilidad:

- `.btn-link` - Enlace en color verde (principal, para navegación)
- `.btn-link-secondary` - Enlace en color azul (secundario, para acciones)

**Ejemplos:**
```tsx
<Link href="/perfil" className="btn-link">
  Mi Perfil
</Link>

<Link href="/login" className="btn-link-secondary">
  Iniciar Sesión
</Link>

<a href="/olvide-contrasena" className="btn-link">
  ¿Olvidaste tu contraseña?
</a>
```

### Formularios

#### Estructura básica:
```tsx
<div className="form-group">
  <label className="form-label">Correo</label>
  <input type="email" className="form-input" placeholder="tu@email.com" />
  <p className="form-help">Usaremos tu email para recuperar tu contraseña</p>
</div>
```

#### Clases principales:
- `.form-group` - Grupo del formulario (con espaciado)
- `.form-label` - Etiqueta del input
- `.form-input` - Input de texto
- `.form-textarea` - Área de texto
- `.form-select` - Select/dropdown
- `.form-error` - Mensaje de error (rojo)
- `.form-help` - Texto de ayuda (gris pequeño)

**Ejemplo con validación:**
```tsx
<div className="form-group">
  <label className="form-label">Contraseña *</label>
  <input 
    type="password" 
    className="form-input" 
    placeholder="Mínimo 6 caracteres"
  />
  {error && <p className="form-error">{error}</p>}
  <p className="form-help">Debe contener mayúsculas y números</p>
</div>
```

### Utilidades

#### `.divider` - Línea separadora
```tsx
<div className="divider" />
```

#### `.badge` - Insignia/etiqueta
```tsx
<span className="badge">Nuevo</span>
<span className="badge badge-success">Confirmado</span>
<span className="badge badge-warning">Pendiente</span>
<span className="badge badge-error">Error</span>
```

#### `.grid-container` - Grid responsivo
```tsx
<div className="grid-container">
  {/* Auto: 1 columna móvil, 2 tablet, 3 desktop */}
  {items.map(item => <div className="card" key={item.id}>{item.name}</div>)}
</div>
```

#### `.shadow-*` - Sombras
```tsx
<div className="shadow-sm">Sombra pequeña</div>
<div className="shadow-md">Sombra media</div>
<div className="shadow-lg">Sombra grande</div>
```

### Ejemplo Completo - Página de Login

```tsx
'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="page-container">
      <div className="content-wrapper">
        <article className="card max-w-md mx-auto">
          <div className="card-header">
            <h1>Login</h1>
            <p className="text-muted">Inicia sesión en tu cuenta</p>
          </div>

          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Correo *</label>
              <input 
                type="email" 
                className="form-input"
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña *</label>
              <input 
                type="password" 
                className="form-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="card-footer">
            <button className="btn btn-primary w-full">
              Iniciar Sesión
            </button>
          </div>
        </article>

        <div className="text-center mt-6">
          <p className="text-muted">
            ¿No tienes cuenta?{' '}
            <Link href="/registrar" className="btn-link">
              Regístrate aquí
            </Link>
          </p>
          <p className="text-muted mt-4">
            <Link href="/olvide-contrasena" className="btn-link">
              Recuperar contraseña
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
```

### Buenas Prácticas

1. **Siempre usa clases semánticas** en lugar de Tailwind puro
   ```tsx
   // ✅ BIEN
   <button className="btn btn-primary">Enviar</button>
   
   // ❌ MAL
   <button className="bg-zs-green text-white px-4 py-2 rounded-lg">Enviar</button>
   ```

2. **Agrupa elementos relacionados con `.card`**
   ```tsx
   // ✅ BIEN
   <div className="card">
     <div className="card-header">...</div>
     <div className="card-body">...</div>
     <div className="card-footer">...</div>
   </div>
   ```

3. **Usa etiquetas HTML semánticas**
   ```tsx
   // ✅ BIEN
   <main className="page-container">
     <h1>Título</h1>
     <nav>...</nav>
   </main>
   
   // ❌ MAL
   <div className="heading-xl">Título</div>
   ```

4. **Mantén consistencia de padding/spacing**
   ```tsx
   // ✅ BIEN - content-wrapper ya tiene padding
   <div className="content-wrapper">Content</div>
   
   // ❌ MAL - No necesitas agregar padding extra
   <div className="content-wrapper px-8">Content</div>
   ```

---

## 📄 Páginas Principales

### **1. Home** (`app/page.tsx`)

Página de bienvenida con:
- Logo y descripción
- Botones de Iniciar Sesión / Registrarse
- Información general del sitio

**Ruta:** `/`

---

### **2. Login** (`app/login/page.tsx`)

Formulario para iniciar sesión:
- Email
- Contraseña
- Enlace "¿Olvidaste tu contraseña?"
- Enlace a registro

**Ruta:** `/login`

**Flujo:**
1. Usuario ingresa email + contraseña
2. Cliente envía a backend `/auth/login`
3. Backend valida y devuelve JWT
4. Cliente guarda token en localStorage
5. Redirecciona a home

---

### **3. Registrar** (`app/registrar/page.tsx`)

Formulario de registro:
- Email
- Contraseña (min 6 caracteres)
- Nombre
- Apellido
- Teléfono (opcional)

**Ruta:** `/registrar`

**Flujo:**
1. Usuario completa formulario
2. Validación en frontend (Zod)
3. Cliente envía a backend `/auth/register`
4. Backend hashea contraseña y crea usuario
5. Devuelve JWT automáticamente
6. Redirecciona a home

---

### **4. Eventos** (`app/eventos/page.tsx`)

Listado de eventos deportivos en grid:
- Buscar eventos
- Filtrar por deporte
- Cards con información del evento
- Enlace a detalle

**Ruta:** `/eventos`

**Card de Evento muestra:**
- Nombre del evento
- Deporte
- Fecha
- Estado (Creado, En curso, Finalizado)
- Número de partidos

---

### **5. Detalle Evento** (`app/eventos/[id]/page.tsx`)

Información completa del evento:
- Nombre y descripción
- Fecha y ubicación
- Partidos del evento
- Tabla de clasificación
- Opción de inscribirse

**Ruta:** `/eventos/:id`

---

### **6. Crear Evento** (`app/crear-evento/page.tsx`)

Formulario para crear eventos (usuarios organizadores):
- Nombre del evento
- Descripción
- Deporte
- Fecha inicio/fin
- Ubicación
- Máximo de participantes

**Ruta:** `/crear-evento`

---

### **7. Clasificación** (`app/clasificacion/page.tsx`)

Tablas de posiciones:
- Selector de eventos
- Tabla dinámicacolumnas:
  - Posición
  - Equipo
  - Partidos jugados
  - Ganados/Empatados/Perdidos
  - Goles a favor/en contra
  - Diferencia de goles
  - Puntos

**Ruta:** `/clasificacion`

---

### **8. Noticias** (`app/noticias/page.tsx`)

Blog de noticias deportivas:
- Listado de posts
- Autor y fecha
- Extracto del contenido
- Enlace a detalle

**Ruta:** `/noticias`

---

### **9. Perfil** (`app/perfil/page.tsx`)

Perfil del usuario autenticado:
- Avatar
- Información personal:
  - Email
  - Nombre y apellido
  - Teléfono
 - Rol (Atleta/Organizador/Admin)
- Botón para editar perfil

**Ruta:** `/perfil` (requiere autenticación)

---

### **10. Olvide Contraseña** (`app/olvide-contrasena/page.tsx`)

Solicitar reset de contraseña:
- Ingresa email
- Backend envía email con enlace
- Usuario sigue enlace en email

**Ruta:** `/olvide-contrasena`

---

### **11. Reset Password** (`app/reset-password/[token]/page.tsx`)

Formulario para cambiar contraseña:
- Nueva contraseña
- Confirmar contraseña
- Validación de token

**Ruta:** `/reset-password/:token`

---

## 🧩 Componentes

### **Navbar** (`components/layout/Navbar.tsx`)

Barra de navegación principal:

**Elementos:**
- Logo (ZoneSport)
- Enlaces de navegación:
  - Inicio
  - Eventos
  - Clasificación
  - Noticias
- Si está autenticado:
  - Botón de perfil (desplegable)
    - Mi Perfil
    - Crear Evento
    - Cerrar Sesión
- Si NO está autenticado:
  - Botón "Iniciar Sesión"
  - Botón "Registrarse"

**Características:**
- Sticky (se queda en top)
- Responsive (menú hamburguesa en móvil)
- Integración con autenticación
- Estilo dark mode

---

## 🔌 Servicios HTTP

Los servicios están en `services/` y manejan la comunicación con la API.

### **api.ts** - Cliente Base

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### **authService.ts** - Autenticación

```typescript
export const authService = {
  register(data) {
    return apiClient.post('/auth/register', data);
  },
  
  login(data) {
    return apiClient.post('/auth/login', data);
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  },
};
```

### **eventsService.ts** - Eventos

```typescript
export const eventsService = {
  getAll() {
    return apiClient.get('/events');
  },
  
  getById(id: number) {
    return apiClient.get(`/events/${id}`);
  },
  
  create(data) {
    return apiClient.post('/events', data);
  },
};
```

---

## 🏗️ Estructura de Carpetas (Etiquetas Semánticas)

### HTML5 Semántico

Se utiliza HTML5 semántico en lugar de `<div>` genéricos:

```tsx
<main>              {/* Contenedor principal */}
<section>           {/* Bloques de contenido lógico */}
<article>           {/* Componentes independientes */}
<header>            {/* Encabezados */}
<footer>            {/* Pies de página */}
<nav>               {/* Navegación */}
<aside>             {/* Información complementaria */}
<form>              {/* Formularios */}
<fieldset>          {/* Grupos de campos */}
```

**Ejemplo:**

```tsx
<main className="min-h-screen bg-zs-dark">
  <header className="mb-8">
    <h1 className="title-h1">Eventos Deportivos</h1>
  </header>
  
  <section className="space-y-4">
    {eventos.map(evento => (
      <article key={evento.id} className="bg-zs-darker rounded-lg p-6">
        <h2 className="title-h2">{evento.name}</h2>
        <p className="text-zs-text-secondary">{evento.description}</p>
      </article>
    ))}
  </section>
</main>
```

---

## 🚀 Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Desarrollo (hot reload en localhost:3000)
npm run dev

# Build para producción
npm build

# Iniciar versión de producción
npm start

# Linting con ESLint
npm run lint
```

---

## 📁 Cómo Agregar una Nueva Página

1. **Crear carpeta con la ruta:**

```bash
mkdir app/mi-nueva-pagina
touch app/mi-nueva-pagina/page.tsx
```

2. **Crear el componente:**

```tsx
// app/mi-nueva-pagina/page.tsx
'use client';

import React from 'react';

export default function MiNuevaPagina() {
  return (
    <main className="min-h-screen bg-zs-dark p-8">
      <header className="mb-8">
        <h1 className="title-h1">Mi Nueva Página</h1>
      </header>
      
      <section className="space-y-4">
        {/* Contenido aquí */}
      </section>
    </main>
  );
}
```

3. **Agregar
 enlace en Navbar:** (si quieres que aparezca en navegación)

4. **Usar servicios HTTP:**

```tsx
import { useState, useEffect } from 'react';
import { miService } from '@/services/miService';

export default function MiPagina() {
  const [datos, setDatos] = useState([]);
  
  useEffect(() => {
    miService.getAll().then(res => setDatos(res.data));
  }, []);
  
  return (/* renderizar datos */);
}
```

---

## 🔨 Cómo Agregar un Nuevo Componente

1. **Crear archivo en `components/`:**

```tsx
// components/MiComponente.tsx
interface MiComponenteProps {
  title: string;
  children: React.ReactNode;
}

export function MiComponente({ title, children }: MiComponenteProps) {
  return (
    <article className="bg-zs-darker p-6 rounded-lg border border-zs-border">
      <h2 className="title-h2 mb-4">{title}</h2>
      {children}
    </article>
  );
}
```

2. **Usar el componente:**

```tsx
import { MiComponente } from '@/components/MiComponente';

export default function MiPagina() {
  return (
    <MiComponente title="Hola">
      <p>Contenido aquí</p>
    </MiComponente>
  );
}
```

---

## 📚 Recursos Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com)

---

**Última actualización**: 12 de Febrero de 2026  
**Versión**: 1.0.0
