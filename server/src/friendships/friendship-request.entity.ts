import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum FriendshipRequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

@Entity('friendship_requests')
export class FriendshipRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    senderId: string;

    @Column('uuid')
    receiverId: string;

    @Column({
        type: 'enum',
        enum: FriendshipRequestStatus,
        default: FriendshipRequestStatus.PENDING,
    })
    status: FriendshipRequestStatus;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receiverId' })
    receiver: User;
}
