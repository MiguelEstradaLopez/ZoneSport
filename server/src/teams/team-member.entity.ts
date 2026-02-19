import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Team } from './team.entity';
import { User } from '../users/user.entity';

@Entity('team_members')
export class TeamMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Team)
    team: Team;

    @ManyToOne(() => User)
    user: User;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    joinedAt: Date;
}
