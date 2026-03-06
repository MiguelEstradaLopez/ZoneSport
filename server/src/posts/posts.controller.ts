import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    async getPosts(@Query('limit') limit?: string) {
        return this.postsService.getPosts(limit ? parseInt(limit) : 20);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPost(
        @Body() body: { content: string; imageBase64?: string },
        @Request() req,
    ) {
        return this.postsService.createPost(req.user.id, body.content, body.imageBase64);
    }

    @Post(':id/vote')
    @UseGuards(JwtAuthGuard)
    async vote(
        @Param('id') postId: string,
        @Body() body: { value: 1 | -1 },
        @Request() req,
    ) {
        return this.postsService.vote(postId, req.user.id, body.value);
    }
}
