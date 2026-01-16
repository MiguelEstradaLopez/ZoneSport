import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Event } from '../events/event.entity';

@Entity('classifications')
@Unique(['eventId', 'teamName'])
export class Classification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    teamName: string;

    @Column({ type: 'int', default: 0 })
    points: number;

    @Column({ type: 'int', default: 0 })
    wins: number;

    @Column({ type: 'int', default: 0 })
    draws: number;

    @Column({ type: 'int', default: 0 })
    losses: number;

    @Column({ type: 'int', default: 0 })
    goalsFor: number;

    @Column({ type: 'int', default: 0 })
    goalsAgainst: number;

    @Column({ type: 'int', default: 0 })
    position: number;

    @ManyToOne(() => Event, (event) => event.classifications, { onDelete: 'CASCADE' })
    event: Event;

    @Column()
    eventId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
