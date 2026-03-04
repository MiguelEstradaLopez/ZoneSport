import { Controller, Get, Patch, Post, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/user.entity';
import { FriendshipsService } from './friendships.service';

@ApiTags('friendships')
@Controller('friendships')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendshipsController {
    constructor(private readonly friendshipsService: FriendshipsService) { }

    @Post('request/:userId')
    @ApiOperation({ summary: 'Enviar solicitud de amistad' })
    async sendRequest(@Param('userId') receiverId: string, @CurrentUser() user: User) {
        return this.friendshipsService.sendRequest(user.id, receiverId);
    }

    @Patch('request/:id/accept')
    @ApiOperation({ summary: 'Aceptar solicitud de amistad' })
    async acceptRequest(@Param('id') requestId: string, @CurrentUser() user: User) {
        return this.friendshipsService.acceptRequest(requestId, user.id);
    }

    @Patch('request/:id/reject')
    @ApiOperation({ summary: 'Rechazar solicitud de amistad' })
    async rejectRequest(@Param('id') requestId: string, @CurrentUser() user: User) {
        return this.friendshipsService.rejectRequest(requestId, user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener mis amigos' })
    async getFriends(@CurrentUser() user: User) {
        return this.friendshipsService.getFriends(user.id);
    }

    @Get('requests/pending')
    @ApiOperation({ summary: 'Obtener solicitudes pendientes' })
    async getPendingRequests(@CurrentUser() user: User) {
        return this.friendshipsService.getPendingRequests(user.id);
    }
}
