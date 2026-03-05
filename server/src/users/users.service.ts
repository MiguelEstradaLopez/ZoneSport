import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ActivityType } from '../activity-types/activity-type.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ActivityType)
    private activityTypesRepository: Repository<ActivityType>,
  ) { }

  private sanitizeUser(user: User) {
    if (!user) return user;
    const { passwordHash, ...safeUser } = user as User & { passwordHash?: string };
    return safeUser;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    if (!createUserDto.password) {
      throw new BadRequestException('La contraseña es obligatoria');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      passwordHash: hashedPassword,
      role: UserRole.ATHLETE,
    });
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findPublicUsers(page = 1, limit = 20, search?: string) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

    const query = this.usersRepository.createQueryBuilder('user');

    if (search?.trim()) {
      query.where(
        'user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
        { search: `%${search.trim()}%` },
      );
    }

    query
      .orderBy('user.createdAt', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    const [items, total] = await query.getManyAndCount();

    return {
      data: items.map((item) => this.sanitizeUser(item)),
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['interests'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  async findPublicProfile(id: string) {
    const user = await this.findOne(id);
    return this.sanitizeUser(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
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

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const user = await this.findOne(userId);
    user.passwordHash = hashedPassword;
    await this.usersRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async addInterest(userId: string, activityTypeId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    const activityType = await this.activityTypesRepository.findOne({
      where: { id: activityTypeId },
    });

    if (!activityType) {
      throw new NotFoundException(`ActivityType con id ${activityTypeId} no encontrado`);
    }

    const alreadyExists = user.interests?.some((interest) => interest.id === activityTypeId);
    if (alreadyExists) {
      return user.interests;
    }

    user.interests = [...(user.interests || []), activityType];
    await this.usersRepository.save(user);

    return user.interests;
  }

  async removeInterest(userId: string, activityTypeId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    user.interests = (user.interests || []).filter((interest) => interest.id !== activityTypeId);
    await this.usersRepository.save(user);

    return user.interests;
  }

  async getUserInterests(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    return user.interests || [];
  }

  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    city?: string;
    profilePicture?: string;
  }) {
    await this.usersRepository.update(userId, data);
    return this.findOne(userId);
  }
}