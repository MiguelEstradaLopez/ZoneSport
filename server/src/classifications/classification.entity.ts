
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Tournament } from '../tournaments/tournament.entity';
import { Team } from '../teams/team.entity';

@Entity('classifications')
export class Classification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Tournament)
    tournament: Tournament;

    @ManyToOne(() => Team)
    team: Team;

    @Column({ type: 'int' })
    position: number;

    @Column({ type: 'int' })
    points: number;

    @Column({ type: 'int' })
    played: number;

    @Column({ type: 'int' })
    wins: number;

    @Column({ type: 'int' })
    draws: number;

    @Column({ type: 'int' })
    losses: number;

    @Column({ type: 'jsonb', nullable: true })
    customStats?: any;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
