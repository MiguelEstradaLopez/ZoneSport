import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity';
import { CreateNewsDto } from './dtos/create-news.dto';
import { User } from '../users/user.entity';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News)
        private newsRepository: Repository<News>,
    ) { }

    async create(createNewsDto: CreateNewsDto, user: User): Promise<News> {
        const news = this.newsRepository.create({
            ...createNewsDto,
            authorId: user.id,
            author: user,
        });
        return this.newsRepository.save(news);
    }

    async findAll(): Promise<News[]> {
        return this.newsRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<News> {
        const news = await this.newsRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!news) {
            throw new NotFoundException(`Noticia con id ${id} no encontrada`);
        }
        return news;
    }

    async update(id: number, createNewsDto: CreateNewsDto, user: User): Promise<News> {
        const news = await this.findOne(id);

        // Verificar que el usuario es el autor
        if (news.authorId !== user.id) {
            throw new ForbiddenException('Solo el autor puede editar esta noticia');
        }

        Object.assign(news, createNewsDto);
        return this.newsRepository.save(news);
    }

    async remove(id: number, user: User): Promise<void> {
        const news = await this.findOne(id);

        // Verificar que el usuario es el autor
        if (news.authorId !== user.id) {
            throw new ForbiddenException('Solo el autor puede eliminar esta noticia');
        }

        await this.newsRepository.remove(news);
    }
}
