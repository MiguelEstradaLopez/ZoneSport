import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostVote } from './post-vote.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
        @InjectRepository(PostVote)
        private readonly voteRepo: Repository<PostVote>,
    ) { }

    async createPost(authorId: string, content: string, imageBase64?: string) {
        if (!content || content.trim().length === 0) {
            throw new BadRequestException('Content is required');
        }
        if (content.length > 500) {
            throw new BadRequestException('Content must be max 500 characters');
        }

        const post = this.postRepo.create({
            authorId,
            content: content.trim(),
            imageBase64: imageBase64 || undefined,
        });

        return this.postRepo.save(post);
    }

    async getPosts(limit: number = 20) {
        return this.postRepo.find({
            order: { createdAt: 'DESC' },
            take: limit,
            relations: ['author'],
        });
    }

    async vote(postId: string, userId: string, value: 1 | -1) {
        // Validar que el post existe
        const post = await this.postRepo.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Buscar voto existente
        const existingVote = await this.voteRepo.findOne({
            where: { postId, userId },
        });

        if (existingVote) {
            // Si es el mismo voto, eliminar (toggle)
            if (existingVote.value === value) {
                await this.voteRepo.remove(existingVote);
                // Actualizar likes en post
                post.likes = Math.max(0, post.likes - value);
            } else {
                // Si es diferente, cambiar voto
                const diff = value - existingVote.value;
                existingVote.value = value;
                await this.voteRepo.save(existingVote);
                post.likes = post.likes + diff;
            }
        } else {
            // Nuevo voto
            const newVote = this.voteRepo.create({ postId, userId, value });
            await this.voteRepo.save(newVote);
            post.likes = post.likes + value;
        }

        await this.postRepo.save(post);
        return { likes: post.likes };
    }

    async getUserVote(postId: string, userId: string) {
        const vote = await this.voteRepo.findOne({
            where: { postId, userId },
        });
        return vote?.value || 0;
    }
}
