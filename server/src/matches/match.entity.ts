import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Event } from '../events/event.entity';

export enum MatchStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    PLAYED = 'PLAYED',
}

@Entity('matches')
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    teamA: string;

    @Column({ type: 'varchar', length: 100 })
    teamB: string;

    @Column({ type: 'int', nullable: true })
    scoreA: number;

    @Column({ type: 'int', nullable: true })
    scoreB: number;

    @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.SCHEDULED })
    status: MatchStatus;

    @Column({ type: 'timestamp' })
    scheduledDate: Date;

    @ManyToOne(() => Event, (event) => event.matches, { onDelete: 'CASCADE' })
    event: Event;

    @Column()
    eventId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
