
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tournament } from '../tournaments/tournament.entity';
import { Team } from '../teams/team.entity';

export enum MatchStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
    CANCELLED = 'CANCELLED',
    POSTPONED = 'POSTPONED',
}

@Entity('matches')
export class Match {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Tournament)
    tournament: Tournament;

    @ManyToOne(() => Team)
    homeTeam: Team;

    @ManyToOne(() => Team)
    awayTeam: Team;

    @Column({ nullable: true }) team1Id?: string;
    @Column({ nullable: true }) team2Id?: string;
    @Column({ nullable: true }) team1Score?: number;
    @Column({ nullable: true }) team2Score?: number;
    @Column({ nullable: true }) scheduledDate?: string;
    @Column({ default: 'PENDING' }) matchStatus: string;
    @Column({ nullable: true }) round?: number;

    @Column({ type: 'enum', enum: MatchStatus })
    status: MatchStatus;

    @Column({ type: 'timestamp with time zone' })
    scheduledAt: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    playedAt?: Date;

    @Column({ type: 'jsonb' })
    result: any;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
