import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum ActivityCategory {
    SPORT = 'SPORT',
    ESPORT = 'ESPORT',
    BOARD_GAME = 'BOARD_GAME',
    TABLETOP_RPG = 'TABLETOP_RPG',
    CARD_GAME = 'CARD_GAME',
    OTHER = 'OTHER',
}

@Entity('activity_types')
export class ActivityType {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'enum', enum: ActivityCategory })
    category: ActivityCategory;

    @Column({ type: 'boolean', default: false })
    isCustom: boolean;

    @Column({ type: 'jsonb' })
    scoringConfig: any;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => User, { nullable: true })
    createdBy?: User;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
