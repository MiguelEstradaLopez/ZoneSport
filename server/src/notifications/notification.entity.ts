import { CreateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    userId: string;

    @Column({ type: 'varchar', length: 100 })
    type: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'uuid', nullable: true })
    referenceId?: string;

    @Column({ type: 'boolean', default: false })
    isRead: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;
}
