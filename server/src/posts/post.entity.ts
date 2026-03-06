import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn()
    author: User;

    @Column()
    authorId: string;

    @Column('text')
    content: string;

    @Column({ nullable: true })
    imageBase64?: string;

    @Column({ default: 0 })
    likes: number;

    @CreateDateColumn()
    createdAt: Date;
}
