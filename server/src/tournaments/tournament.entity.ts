import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ActivityType } from '../activity-types/activity-type.entity';
import { User } from '../users/user.entity';

export enum TournamentFormat {
    LEAGUE = 'LEAGUE',
    SINGLE_ELIMINATION = 'SINGLE_ELIMINATION',
    DOUBLE_ELIMINATION = 'DOUBLE_ELIMINATION',
    ROUND_ROBIN = 'ROUND_ROBIN',
    CUSTOM = 'CUSTOM',
}

export enum TournamentStatus {
    DRAFT = 'DRAFT',
    REGISTRATION_OPEN = 'REGISTRATION_OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
    CANCELLED = 'CANCELLED',
}

@Entity('tournaments')
export class Tournament {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => ActivityType)
    activityType: ActivityType;

    @ManyToOne(() => User)
    organizer: User;

    @Column({ type: 'enum', enum: TournamentFormat })
    format: TournamentFormat;

    @Column({ type: 'enum', enum: TournamentStatus })
    status: TournamentStatus;

    @Column({ type: 'int' })
    maxTeams: number;

    @Column({ type: 'timestamp with time zone' })
    startDate: Date;

    @Column({ type: 'timestamp with time zone' })
    endDate: Date;

    @Column({ type: 'jsonb', nullable: true })
    customScoringConfig?: any;

    @Column({ type: 'boolean', default: true })
    isPublic: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
