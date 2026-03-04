import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/user.entity';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener mis notificaciones' })
    async findMyNotifications(@CurrentUser() user: User) {
        return this.notificationsService.findUserNotifications(user.id);
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Marcar notificación como leída' })
    async markAsRead(@Param('id') notificationId: string, @CurrentUser() user: User) {
        return this.notificationsService.markAsRead(notificationId, user.id);
    }
}
