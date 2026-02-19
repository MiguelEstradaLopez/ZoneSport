
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    userId: string;

    @Column({ type: 'text' })
    token: string;

    @Column({ type: 'timestamp with time zone' })
    expiresAt: Date;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;
}
