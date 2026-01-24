# 💻 Ejemplos de Código - ZoneSport Entidades Nuevas

Ejemplos de TypeScript para las nuevas entidades y servicios que necesita ZoneSport para ser 100% funcional.

---

## 1. Entidad Post

**Ubicación:** `server/src/posts/post.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Like } from './like.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column('varchar', { length: 250 })
  content: string;

  @Column('simple-array', { nullable: true })
  images: string[]; // URLs de Cloudinary/S3

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @OneToMany(() => Like, (like) => like.post, { cascade: true })
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 2. Entidad Invitation

**Ubicación:** `server/src/invitations/invitation.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

export type InvitationType = 'friend' | 'event' | 'team';
export type InvitationStatus = 'pending' | 'accepted' | 'rejected';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  sender: User;

  @ManyToOne(() => User, { eager: true })
  recipient: User;

  @ManyToOne(() => Event, { nullable: true, eager: true })
  event?: Event;

  @Column({ type: 'enum', enum: ['friend', 'event', 'team'] })
  type: InvitationType;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: InvitationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date; // 30 días después de creación

  @Column({ nullable: true })
  message?: string; // Mensaje personalizado
}
```

---

## 3. Entidad Comment

**Ubicación:** `server/src/comments/comment.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Like } from '../posts/like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  author: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  post: Post;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  likesCount: number;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 4. Entidad Like

**Ubicación:** `server/src/posts/like.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
@Unique(['user', 'post'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  post?: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  comment?: Comment;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 5. DTO: CreatePostDto

**Ubicación:** `server/src/posts/dtos/create-post.dto.ts`

```typescript
import { IsString, Length, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1, 250, { message: 'El post debe tener entre 1 y 250 caracteres' })
  content: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[]; // URLs de imágenes cargadas
}
```

---

## 6. DTO: CreateInvitationDto

**Ubicación:** `server/src/invitations/dtos/create-invitation.dto.ts`

```typescript
import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { InvitationType } from '../invitation.entity';

export class CreateInvitationDto {
  @IsNumber()
  recipientId: number;

  @IsEnum(['friend', 'event', 'team'])
  type: InvitationType;

  @IsOptional()
  @IsNumber()
  eventId?: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  message?: string;
}
```

---

## 7. Servicio: PostsService (Principal)

**Ubicación:** `server/src/posts/posts.service.ts`

```typescript
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  // Crear post
  async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    if (createPostDto.content.length > 250) {
      throw new BadRequestException('El post no puede exceder 250 caracteres');
    }

    if (createPostDto.images && createPostDto.images.length > 2) {
      throw new BadRequestException('No puedes adjuntar más de 2 imágenes');
    }

    const post = this.postsRepository.create({
      user: { id: userId },
      content: createPostDto.content,
      images: createPostDto.images || [],
    });

    return this.postsRepository.save(post);
  }

  // Listar posts (feed - últimos primero)
  async findAll(limit = 20, offset = 0): Promise<Post[]> {
    return this.postsRepository.find({
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
      relations: ['user', 'likes', 'comments'],
    });
  }

  // Posts de un usuario específico
  async findByUser(userId: number, limit = 20, offset = 0): Promise<Post[]> {
    return this.postsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
      relations: ['user', 'likes', 'comments'],
    });
  }

  // Obtener un post específico
  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'likes', 'comments', 'comments.author'],
    });

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    return post;
  }

  // Eliminar post (solo el autor)
  async remove(id: number, userId: number): Promise<void> {
    const post = await this.findOne(id);

    if (post.user.id !== userId) {
      throw new BadRequestException('No tienes permiso para eliminar este post');
    }

    await this.postsRepository.remove(post);
  }
}
```

---

## 8. Servicio: InvitationsService (Principal)

**Ubicación:** `server/src/invitations/invitations.service.ts`

```typescript
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Invitation } from './invitation.entity';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';
import { CreateInvitationDto } from './dtos/create-invitation.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private emailService: EmailService,
  ) {}

  // Enviar invitación
  async create(
    senderId: number,
    createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation> {
    const { recipientId, type, eventId, message } = createInvitationDto;

    // Validar que no se invite a uno mismo
    if (senderId === recipientId) {
      throw new BadRequestException('No puedes invitarte a ti mismo');
    }

    // Validar que el destinatario exista
    const recipient = await this.usersRepository.findOne({
      where: { id: recipientId },
    });

    if (!recipient) {
      throw new NotFoundException('Usuario destinatario no encontrado');
    }

    // Validar evento si aplica
    if (eventId) {
      const event = await this.eventsRepository.findOne({
        where: { id: eventId },
      });
      if (!event) {
        throw new NotFoundException('Evento no encontrado');
      }
    }

    // Validar que no haya invitación pendiente
    const existing = await this.invitationsRepository.findOne({
      where: {
        sender: { id: senderId },
        recipient: { id: recipientId },
        status: 'pending',
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Ya existe una invitación pendiente para este usuario',
      );
    }

    // Crear invitación
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 días

    const invitation = this.invitationsRepository.create({
      sender: { id: senderId },
      recipient: { id: recipientId },
      type,
      event: eventId ? { id: eventId } : null,
      message,
      expiresAt,
    });

    const saved = await this.invitationsRepository.save(invitation);

    // Enviar email
    await this.emailService.sendInvitation(recipient.email, {
      senderName: (await this.usersRepository.findOne({ where: { id: senderId } })).firstName,
      type,
      message,
    });

    return saved;
  }

  // Listar invitaciones pendientes
  async findPending(userId: number): Promise<Invitation[]> {
    return this.invitationsRepository.find({
      where: {
        recipient: { id: userId },
        status: 'pending',
      },
      relations: ['sender', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  // Aceptar invitación
  async accept(invitationId: number, userId: number): Promise<Invitation> {
    const invitation = await this.invitationsRepository.findOne({
      where: { id: invitationId },
      relations: ['recipient'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }

    if (invitation.recipient.id !== userId) {
      throw new BadRequestException('No tienes permiso para aceptar esta invitación');
    }

    invitation.status = 'accepted';
    return this.invitationsRepository.save(invitation);
  }

  // Rechazar invitación
  async reject(invitationId: number, userId: number): Promise<Invitation> {
    const invitation = await this.invitationsRepository.findOne({
      where: { id: invitationId },
      relations: ['recipient'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }

    if (invitation.recipient.id !== userId) {
      throw new BadRequestException('No tienes permiso para rechazar esta invitación');
    }

    invitation.status = 'rejected';
    return this.invitationsRepository.save(invitation);
  }
}
```

---

## 9. Controlador: PostsController

**Ubicación:** `server/src/posts/posts.controller.ts`

```typescript
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo post' })
  @ApiResponse({ status: 201, description: 'Post creado exitosamente' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: User,
  ) {
    return this.postsService.create(user.id, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener feed de posts' })
  @ApiResponse({ status: 200, description: 'Lista de posts' })
  async findAll(@Query('limit') limit = 20, @Query('offset') offset = 0) {
    return this.postsService.findAll(limit, offset);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener posts de un usuario' })
  async findByUser(
    @Param('userId') userId: number,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return this.postsService.findByUser(userId, limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un post específico' })
  async findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un post' })
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    await this.postsService.remove(id, user.id);
    return { message: 'Post eliminado exitosamente' };
  }
}
```

---

## 10. Servicio: Upload de Imágenes (Cloudinary)

**Ubicación:** `server/src/upload/cloudinary.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'zonesport/posts',
          resource_type: 'auto',
          quality: 'auto',
          max_bytes: 5242880, // 5MB
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
```

---

## 11. Controlador: InvitationsController

**Ubicación:** `server/src/invitations/invitations.controller.ts`

```typescript
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dtos/create-invitation.dto';

@Controller('invitations')
@ApiTags('invitations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar una invitación' })
  async create(
    @Body() createInvitationDto: CreateInvitationDto,
    @CurrentUser() user: User,
  ) {
    return this.invitationsService.create(user.id, createInvitationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener invitaciones pendientes' })
  async findPending(@CurrentUser() user: User) {
    return this.invitationsService.findPending(user.id);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Aceptar una invitación' })
  async accept(@Param('id') id: number, @CurrentUser() user: User) {
    return this.invitationsService.accept(id, user.id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Rechazar una invitación' })
  async reject(@Param('id') id: number, @CurrentUser() user: User) {
    return this.invitationsService.reject(id, user.id);
  }
}
```

---

## 12. Actualizar Event.entity.ts

```typescript
// Agregar estos campos a server/src/events/event.entity.ts:

@ManyToOne(() => Sport, { eager: true })
sport: Sport;

@Column()
startDate: Date;

@Column()
endDate: Date;

@Column('double', { nullable: true })
latitude: number;

@Column('double', { nullable: true })
longitude: number;

@Column({ nullable: true })
address: string;

@Column({ nullable: true })
venue: string; // Nombre del lugar

@Column('int')
maxParticipants: number;

@Column({
  type: 'enum',
  enum: ['individual', 'equipos'],
  default: 'individual',
})
format: 'individual' | 'equipos';

@Column({
  type: 'enum',
  enum: ['creado', 'en_curso', 'finalizado'],
  default: 'creado',
})
status: 'creado' | 'en_curso' | 'finalizado';

@ManyToOne(() => User)
createdBy: User;

@Column({ nullable: true })
bracketType: '4' | '8' | '16' | '32' | '64'; // Tamaño del bracket

@Column('simple-json', { nullable: true })
bracket: Record<string, any>; // Estructura del árbol de torneo
```

---

## 13. Configuración en .env

```bash
# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALENDAR_CALLBACK_URL=http://localhost:3001/api/calendar/callback

# Google Maps
GOOGLE_MAPS_API_KEY=tu_api_key

# Stripe (si aplica)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 14. Instalar Dependencias Necesarias

```bash
cd server

# Cloudinary
npm install cloudinary

# Google
npm install google-auth-library @googleapis/calendar

# WebSocket
npm install @nestjs/websockets socket.io

# Upload
npm install multer @types/multer

# Maps
npm install @react-google-maps/api

# Pagos (opcional)
npm install stripe
```

---

## 15. Ejemplo: CreatePostDto en Swagger

```json
{
  "content": "¡Ganamos el partido 3-2! Excelente desempeño del equipo 🏆",
  "images": [
    "https://res.cloudinary.com/.../imagen1.jpg",
    "https://res.cloudinary.com/.../imagen2.jpg"
  ]
}
```

---

## 16. Ejemplo: CreateInvitationDto en Swagger

```json
{
  "recipientId": 5,
  "type": "event",
  "eventId": 2,
  "message": "Te invito a que participes en el torneo de fútbol que estoy organizando"
}
```

---

Este código sirve como base para implementar las nuevas features. Cada uno puede ser adaptado según tus necesidades específicas.

**Última actualización:** 23 de enero de 2026
