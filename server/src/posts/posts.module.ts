import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostVote } from './post-vote.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostVote])],
    controllers: [PostsController],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule { }
