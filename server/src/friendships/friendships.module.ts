import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipsController } from './friendships.controller';
import { FriendshipsService } from './friendships.service';
import { FriendshipRequest } from './friendship-request.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([FriendshipRequest]),
        UsersModule,
        NotificationsModule,
    ],
    controllers: [FriendshipsController],
    providers: [FriendshipsService],
    exports: [FriendshipsService],
})
export class FriendshipsModule { }
