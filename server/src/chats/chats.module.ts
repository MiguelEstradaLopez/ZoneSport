import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Message])],
    providers: [ChatsService],
    controllers: [ChatsController],
})
export class ChatsModule { }
