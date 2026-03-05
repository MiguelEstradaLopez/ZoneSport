import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ChatsService } from './chats.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
    constructor(private chatsService: ChatsService) { }

    @Post('send')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async sendMessage(
        @CurrentUser() user: User,
        @Body() body: { receiverId: string; content: string },
    ) {
        if (!body.receiverId || !body.content) {
            throw new Error('receiverId y content son requeridos');
        }

        return this.chatsService.sendMessage(
            user.id,
            body.receiverId,
            body.content,
        );
    }

    @Get('conversation/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getConversation(
        @CurrentUser() user: User,
        @Param('userId') userId: string,
        @Query('limit') limit?: string,
    ) {
        const limitNum = limit ? Math.min(parseInt(limit), 500) : 50;
        return this.chatsService.getConversation(user.id, userId, limitNum);
    }

    @Get('conversations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getConversations(@CurrentUser() user: User) {
        return this.chatsService.getConversations(user.id);
    }
}
