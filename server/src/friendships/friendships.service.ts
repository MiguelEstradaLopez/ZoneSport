import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    FriendshipRequest,
    FriendshipRequestStatus,
} from './friendship-request.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FriendshipsService {
    constructor(
        @InjectRepository(FriendshipRequest)
        private readonly friendshipRequestsRepository: Repository<FriendshipRequest>,
        private readonly usersService: UsersService,
        private readonly notificationsService: NotificationsService,
    ) { }

    async sendRequest(senderId: string, receiverId: string): Promise<FriendshipRequest> {
        if (senderId === receiverId) {
            throw new BadRequestException('No puedes enviarte una solicitud a ti mismo');
        }

        await this.usersService.findOne(senderId);
        const receiver = await this.usersService.findOne(receiverId);

        const existingRequest = await this.friendshipRequestsRepository.findOne({
            where: [
                {
                    senderId,
                    receiverId,
                    status: FriendshipRequestStatus.PENDING,
                },
                {
                    senderId: receiverId,
                    receiverId: senderId,
                    status: FriendshipRequestStatus.PENDING,
                },
                {
                    senderId,
                    receiverId,
                    status: FriendshipRequestStatus.ACCEPTED,
                },
                {
                    senderId: receiverId,
                    receiverId: senderId,
                    status: FriendshipRequestStatus.ACCEPTED,
                },
            ],
        });

        if (existingRequest) {
            throw new BadRequestException('Ya existe una solicitud o amistad entre estos usuarios');
        }

        const request = this.friendshipRequestsRepository.create({
            senderId,
            receiverId,
            status: FriendshipRequestStatus.PENDING,
        });

        const savedRequest = await this.friendshipRequestsRepository.save(request);

        await this.notificationsService.create(
            receiverId,
            'FRIEND_REQUEST',
            'Tienes una nueva solicitud de amistad',
            savedRequest.id,
        );

        return savedRequest;
    }

    async acceptRequest(requestId: string, userId: string): Promise<FriendshipRequest> {
        const request = await this.friendshipRequestsRepository.findOne({
            where: { id: requestId },
            relations: ['sender', 'receiver'],
        });

        if (!request) {
            throw new NotFoundException('Solicitud no encontrada');
        }

        if (request.receiverId !== userId) {
            throw new BadRequestException('No puedes aceptar esta solicitud');
        }

        if (request.status !== FriendshipRequestStatus.PENDING) {
            throw new BadRequestException('Esta solicitud ya fue procesada');
        }

        request.status = FriendshipRequestStatus.ACCEPTED;
        const savedRequest = await this.friendshipRequestsRepository.save(request);

        await this.notificationsService.create(
            request.senderId,
            'FRIEND_REQUEST_ACCEPTED',
            'Tu solicitud de amistad fue aceptada',
            savedRequest.id,
        );

        return savedRequest;
    }

    async rejectRequest(requestId: string, userId: string): Promise<FriendshipRequest> {
        const request = await this.friendshipRequestsRepository.findOne({
            where: { id: requestId },
        });

        if (!request) {
            throw new NotFoundException('Solicitud no encontrada');
        }

        if (request.receiverId !== userId) {
            throw new BadRequestException('No puedes rechazar esta solicitud');
        }

        if (request.status !== FriendshipRequestStatus.PENDING) {
            throw new BadRequestException('Esta solicitud ya fue procesada');
        }

        request.status = FriendshipRequestStatus.REJECTED;
        return this.friendshipRequestsRepository.save(request);
    }

    async getFriends(userId: string) {
        const requests = await this.friendshipRequestsRepository.find({
            where: [
                { senderId: userId, status: FriendshipRequestStatus.ACCEPTED },
                { receiverId: userId, status: FriendshipRequestStatus.ACCEPTED },
            ],
            relations: ['sender', 'receiver'],
            order: { createdAt: 'DESC' },
        });

        return requests.map((request) => {
            const friend = request.senderId === userId ? request.receiver : request.sender;
            const { passwordHash, ...friendWithoutPassword } = friend;
            return friendWithoutPassword;
        });
    }

    async getPendingRequests(userId: string): Promise<FriendshipRequest[]> {
        return this.friendshipRequestsRepository.find({
            where: {
                receiverId: userId,
                status: FriendshipRequestStatus.PENDING,
            },
            relations: ['sender', 'receiver'],
            order: { createdAt: 'DESC' },
        });
    }
}
