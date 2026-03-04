import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationsRepository: Repository<Notification>,
    ) { }

    async create(userId: string, type: string, message: string, referenceId?: string): Promise<Notification> {
        const notification = this.notificationsRepository.create({
            userId,
            type,
            message,
            referenceId,
            isRead: false,
        });

        return this.notificationsRepository.save(notification);
    }

    async findUserNotifications(userId: string): Promise<Notification[]> {
        return this.notificationsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(notificationId: string, userId: string): Promise<Notification> {
        const notification = await this.notificationsRepository.findOne({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            throw new NotFoundException('Notificación no encontrada');
        }

        notification.isRead = true;
        return this.notificationsRepository.save(notification);
    }
}
