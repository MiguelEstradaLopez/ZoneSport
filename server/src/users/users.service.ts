import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Verificar si el usuario ya existe
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    if (!createUserDto.password) {
      throw new BadRequestException('La contraseña es obligatoria');
    }

    // 2. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 3. Crear instancia y guardar
    const newUser = this.usersRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se intenta cambiar el email, verificar que no esté registrado
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException(
          'El nuevo correo electrónico ya está registrado',
        );
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async searchByEmail(email: string, excludeId?: string): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');
    query.where('user.email ILIKE :email', { email: `%${email}%` });
    if (excludeId) {
      query.andWhere('user.id != :excludeId', { excludeId });
    }
    return query.take(10).getMany();
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    const user = await this.findOne(userId);
    user.passwordHash = hashedPassword;
    return this.usersRepository.save(user);
  }
}
