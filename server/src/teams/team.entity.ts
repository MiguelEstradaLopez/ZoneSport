import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tournament } from '../tournaments/tournament.entity';
import { User } from '../users/user.entity';

@Entity('teams')
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Tournament)
    tournament: Tournament;

    @Column({ nullable: true })
    tournamentId?: string;

    @Column('jsonb', { nullable: true, default: [] })
    members?: string[];

    @ManyToOne(() => User, { nullable: true })
    captain?: User;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
