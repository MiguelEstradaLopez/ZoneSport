import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Sport } from '../sports/sport.entity';
import { Match } from '../matches/match.entity';
import { Classification } from '../classifications/classification.entity';

/*
export enum EventStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
}

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: EventStatus, default: EventStatus.SCHEDULED })
    status: EventStatus;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date;

    @ManyToOne(() => User, (user) => user.organizedEvents)
    organizer: User;

    @Column()
    organizerId: number;

    @ManyToOne(() => Sport, (sport) => sport.events)
    sport: Sport;

    @Column()
    sportId: number;

    @OneToMany(() => Match, (match) => match.event, { cascade: true })
    matches: Match[];

    @OneToMany(() => Classification, (classification) => classification.event, { cascade: true })
    classifications: Classification[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
*/
