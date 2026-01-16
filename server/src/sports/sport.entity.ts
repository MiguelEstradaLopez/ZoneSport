import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from '../events/event.entity';

@Entity('sports')
export class Sport {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json', default: {} })
    classificationRules: {
        pointsForWin: number;
        pointsForDraw: number;
        pointsForLoss: number;
    };

    @OneToMany(() => Event, (event) => event.sport)
    events: Event[];
}
