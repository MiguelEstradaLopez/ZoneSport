import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('post_votes')
export class PostVote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    postId: string;

    @Column()
    userId: string;

    @Column()
    value: number; // 1 o -1
}
