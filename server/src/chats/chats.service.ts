import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
    ) { }

    async sendMessage(
        senderId: string,
        receiverId: string,
        content: string,
    ): Promise<Message> {
        // Validar longitud del contenido
        if (!content || content.trim().length === 0) {
            throw new Error('El contenido del mensaje no puede estar vacío');
        }
        if (content.length > 500) {
            throw new Error('El mensaje no puede exceder 500 caracteres');
        }

        // Crear y guardar el mensaje
        const message = this.messagesRepository.create({
            senderId,
            receiverId,
            content: content.trim(),
        });

        return this.messagesRepository.save(message);
    }

    async getConversation(
        userId1: string,
        userId2: string,
        limit: number = 50,
    ): Promise<Message[]> {
        return this.messagesRepository
            .createQueryBuilder('message')
            .where(
                '(message.senderId = :userId1 AND message.receiverId = :userId2) OR (message.senderId = :userId2 AND message.receiverId = :userId1)',
                { userId1, userId2 },
            )
            .orderBy('message.createdAt', 'ASC')
            .take(limit)
            .getMany();
    }

    async getConversations(userId: string): Promise<any[]> {
        const messages = await this.messagesRepository
            .createQueryBuilder('message')
            .where(
                'message.senderId = :userId OR message.receiverId = :userId',
                { userId },
            )
            .orderBy('message.createdAt', 'DESC')
            .getMany();

        // Agrupar por conversación (obtener el último mensaje de cada usuario)
        const conversationMap = new Map<string, Message>();

        for (const message of messages) {
            const otherUserId =
                message.senderId === userId ? message.receiverId : message.senderId;

            if (!conversationMap.has(otherUserId)) {
                conversationMap.set(otherUserId, message);
            }
        }

        // Convertir a array y retornar
        return Array.from(conversationMap.entries()).map(
            ([otherUserId, lastMessage]) => ({
                userId: otherUserId,
                lastMessage,
            }),
        );
    }
}
