# 🗄️ Gestión de Base de Datos - ZoneSport

Guía completa sobre la base de datos PostgreSQL, migraciones y cómo usar TypeORM.

---

## 📋 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Estructura de Datos](#-estructura-de-datos)
3. [Configuración](#-configuración)
4. [Migraciones](#-migraciones)
5. [Operaciones Comunes](#-operaciones-comunes)
6. [Troubleshooting](#-troubleshooting)

---

## 🎯 Visión General

### Tecnología

- **SGBD**: PostgreSQL 16 (Alpine Docker)
- **ORM**: TypeORM 0.3.28
- **Driver**: pg (node-postgres)
- **Versión Node**: v18+

### Características

✅ Esquema automático con `synchronize: true` (desarrollo)  
✅ Migraciones formales para producción  
✅ Relaciones tipadas entre entidades  
✅ Validaciones en BD (UNIQUE, NOT NULL, Foreign Keys)  
✅ Logs de auditoría (createdAt, updatedAt)  

---

## 📊 Estructura de Datos

### Diagrama Entidad-Relación (ER)

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ ★id (PK)        │
│ email (UNIQUE)  │
│ password        │ ← Bcrypted!
│ firstName       │
│ lastName        │
│ phone           │
│ role (ENUM)     │  ATHLETE
│ createdAt       │  ORGANIZER
│ updatedAt       │  ADMIN
└────────┬────────┘
         │ 1:N
         ├─────────────→ events (organizer)
         │
         ├─────────────→ news (author)
         │
         └─────────────→ password_reset_token
                        
┌─────────────────┐
│     sports      │
├─────────────────┤
│ ★id (PK)        │
│ name (UNIQUE)   │
│ description     │
│ classificationRules (JSON)
└────────┬────────┘
         │ 1:N
         └─────────────→ events
         
┌─────────────────────┐
│      events         │
├─────────────────────┤
│ ★id (PK)            │
│ name                │
│ description         │
│ status (ENUM)       │  SCHEDULED
│ startDate           │  IN_PROGRESS
│ endDate             │  FINISHED
│ organizerId (FK)    │
│ sportId (FK)        │
│ createdAt           │
│ updatedAt           │
└────────┬────────────┘
         │ 1:N
         ├─────────────→ matches
         │
         └─────────────→ classifications
         
┌──────────────────┐
│     matches      │
├──────────────────┤
│ ★id (PK)         │
│ teamA            │
│ teamB            │
│ scoreA           │
│ scoreB           │
│ status (ENUM)    │  SCHEDULED
│ scheduledDate    │  IN_PROGRESS
│ eventId (FK)     │  PLAYED
│ createdAt        │
│ updatedAt        │
└──────────────────┘

┌─────────────────────────┐
│  classifications        │
├─────────────────────────┤
│ ★id (PK)                │
│ teamName                │
│ points                  │
│ wins, draws, losses     │
│ goalsFor, goalsAgainst  │
│ position (ranking)      │
│ eventId (FK, UNIQUE*)   │ *Unique con teamName
│ createdAt               │
│ updatedAt               │
└─────────────────────────┘

┌──────────────────┐
│      news        │
├──────────────────┤
│ ★id (PK)         │
│ title            │
│ content          │
│ summary          │
│ imageUrl         │
│ authorId (FK)    │
│ createdAt        │
│ updatedAt        │
└──────────────────┘

┌────────────────────────┐
│ password_reset_token   │
├────────────────────────┤
│ ★id (PK)               │
│ token (UNIQUE)         │
│ userId (FK)            │
│ expiresAt              │
│ createdAt              │
└────────────────────────┘
```

---

## ⚙️ Configuración

### Archivo: `server/src/app.module.ts`

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,        // localhost (desarrollo)
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,  // miki_user
  password: process.env.DB_PASSWORD,  // 7667
  database: process.env.DB_NAME,      // zonesport_db
  entities: [
    User, Sport, Event, Match, 
    Classification, News, PasswordResetToken
  ],
  synchronize: true,        // ⚠️ SOLO en desarrollo
  autoLoadEntities: true,   // Auto-load entities
  logging: process.env.NODE_ENV === 'development',  // SQL logs
}),
```

### Desarrollo vs. Producción

| Setting | Desarrollo | Producción |
|---------|-----------|-----------|
| `synchronize` | `true` | `false` |
| `logging` | `true` | `false` |
| Migraciones | Auto (entidades) | Manual (migrations/) |
| Pool conexiones | 10 | 20+ |
| SSL | No | Sí (recomendado) |

---

## 🔄 Migraciones

### ¿Qué son las migraciones?

Son archivos que describen cambios en el schema de BD. Permiten versionar la estructura como código.

```typescript
// Migración típica
export class CreateUsersTable1708000001000 implements MigrationInterface {
  // UP: Cambios a aplicar
  async up(queryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'integer', isPrimary: true, ... },
          { name: 'email', type: 'varchar', isUnique: true, ... },
          ...
        ]
      })
    );
  }
  
  // DOWN: Revertir cambios
  async down(queryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

### Ubicación

```
server/src/migrations/
├── 1708000001000-CreateUsersTable.ts
├── 1708000002000-CreateSportsTable.ts
├── 1708000003000-CreateEventsTable.ts
├── 1708000004000-CreateMatchesTable.ts
├── 1708000005000-CreateClassificationsTable.ts
├── 1708000006000-CreateNewsTable.ts
└── 1708000007000-CreatePasswordResetTokenTable.ts
```

### Convención de Nombres

```
TIMESTAMP-Description.ts

1708000001000 = fecha/hora en milisegundos
CreateUsersTable = descripción clara del cambio
```

### Ejecutar Migraciones

```bash
# Ver estado
npm run typeorm:show

# Ejecutar migraciones pendientes
npm run typeorm:run

# Revertir última migración
npm run typeorm:revert

# Generar migración (si cambias entidad)
npm run typeorm:generate src/migrations/NuevaTabla
```

### Scripts en package.json (Backend)

```json
{
  "scripts": {
    "typeorm": "typeorm-cli",
    "typeorm:run": "typeorm migration:run -d src/data-source.ts",
    "typeorm:revert": "typeorm migration:revert -d src/data-source.ts",
    "typeorm:show": "typeorm migration:show -d src/data-source.ts",
    "typeorm:generate": "typeorm migration:generate -d src/data-source.ts"
  }
}
```

---

## 🛠️ Operaciones Comunes

### 1. Agregar nueva tabla

```typescript
// 1. Crear entity
// server/src/mi-feature/mi-feature.entity.ts
@Entity('mi_tabla')
export class MiTabla {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
}

// 2. Generar migración automática
npm run typeorm:generate src/migrations/CreateMiTabla

// 3. Ejecutar migración
npm run typeorm:run

// 4. Registrar en app.module.ts
TypeOrmModule.forRoot({
  entities: [..., MiTabla],
})
```

### 2. Agregar campo a tabla existente

```typescript
// 1. Actualizar entity
@Entity('users')
export class User {
  // campos existentes ...
  
  @Column({ nullable: true }) // ← Nuevo campo
  ciudad: string;
}

// 2. Generar migración
npm run typeorm:generate src/migrations/AddCiudadToUsers

// 3. Ejecutar
npm run typeorm:run
```

### 3. Crear relación entre tablas

```typescript
// Relación 1:N (Usuario → Eventos)
@Entity()
export class User {
  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];
}

@Entity()
export class Event {
  @ManyToOne(() => User, (user) => user.events)
  organizer: User;
  
  @Column()
  organizerId: number;  // Foreign Key
}

// Generar migración
npm run typeorm:generate src/migrations/AddEventOrganizerRelation

// Ejecutar
npm run typeorm:run
```

### 4. Consultar datos desde el backend

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Obtener todos
  findAll() {
    return this.usersRepository.find();
  }

  // Obtener por ID con relaciones
  findById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['organizedEvents'],  // Incluir relación
    });
  }

  // Crear
  async create(data: CreateUserDto) {
    return this.usersRepository.save({
      email: data.email,
      password: bcrypt.hash(data.password, 10),
      firstName: data.firstName,
    });
  }

  // Actualizar
  update(id: number, data: UpdateUserDto) {
    return this.usersRepository.update(id, data);
  }

  // Eliminar
  delete(id: number) {
    return this.usersRepository.delete(id);
  }

  // Búsqueda avanzada
  searchByEmail(email: string) {
    return this.usersRepository.find({
      where: { email: ILike(`%${email}%`) },  // ILIKE = case-insensitive
    });
  }
}
```

### 5. Seed inicial (datos de prueba)

```typescript
// server/src/seeds/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SportsService } from '../sports/sports.service';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const sportsService = app.get(SportsService);

  // Agregar deportes iniciales
  await sportsService.create({
    name: 'Fútbol',
    description: 'Deporte de 11 vs 11',
    classificationRules: {
      pointsForWin: 3,
      pointsForDraw: 1,
      pointsForLoss: 0,
    },
  });

  await sportsService.create({
    name: 'Baloncesto',
    description: 'Deporte de 5 vs 5',
    classificationRules: {
      pointsForWin: 2,
      pointsForDraw: 0,
      pointsForLoss: 0,
    },
  });

  console.log('✅ Seed completado');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
```

**Ejecutar seed:**

```bash
npm run seed
```

---

## 🔧 Configuración TypeORM en Producción

### Data Source (Para migraciones)

```typescript
// server/src/data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,  // ❌ NUNCA en producción
  logging: false,
});
```

### Pool de Conexiones

```typescript
// En app.module.ts (producción)
TypeOrmModule.forRoot({
  // ... configuración
  extra: {
    max: 20,           // Máximo de conexiones
    min: 5,            // Mínimo de conexiones
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
})
```

---

## 🐛 Troubleshooting

### Error: "relation does not exist"

**Causa**: Tabla no existe (migración no ejecutada)

**Solución**:

```bash
npm run typeorm:run
```

### Error: "duplicate key value violates unique constraint"

**Causa**: Intentas insertar email duplicado

**Solución**:

```typescript
// Validar antes de insertar
const exists = await usersService.findByEmail(email);
if (exists) throw new ConflictException('Email ya existe');
```

### Error: "column does not exist"

**Causa**: Código referencia columna que no existe en BD

**Solución**:

```bash
# Asegúrate de ejecutar migraciones
npm run typeorm:run
npm run typeorm:show  # Ver estado
```

### Base de datos está lenta

**Causas**:

- Falta índices en columnas frecuentes
- Conexiones sin cerrar
- Queries mal optimizadas

**Solución - agregar índices**:

```typescript
@Entity()
export class User {
  @Index()  // ← Índice en email
  @Column()
  email: string;
}
```

### PostgreSQL no inicia en Docker

```bash
# Ver logs
docker-compose logs postgres

# Reiniciar
docker-compose restart postgres

# Recrear
docker-compose down
docker-compose up postgres -d
```

---

## 📚 Recursos

- [TypeORM Docs](https://typeorm.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [NestJS + TypeORM](https://docs.nestjs.com/techniques/database)
- [Query Builder](https://typeorm.io/select-query-builder)
- [Relations](https://typeorm.io/relations)

---

**Última actualización**: 15 de Febrero de 2026  
**Versión**: 1.0.0  
**Mantenedor**: Miguel Estrada López
