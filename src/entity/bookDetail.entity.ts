import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import Book from './book.entity';
import Subscription from './subscription.entity';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Genre } from '../utils/genre.enum';
import Review from './reviews.entity';
import { GenreDB } from './genre.entity';

@Entity()
class BookDetail {
    @PrimaryColumn('bigint')
    isbn: number;

    @Index()
    @Column()
    title: string;

    @Column()
    author: string;

    @Column('text')
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => Subscription, (subscription) => subscription.bookDetail)
    subscriptions: Subscription[];

    @OneToMany(() => Book, (book) => book.bookDetail)
    books: Book[];

    @ManyToOne(() => GenreDB, { eager: true })
    genre: GenreDB;

    @IsNotEmpty()
    @IsNumber()
    @Column({ default: 0 })
    borrow_count: number;

    @OneToMany(() => Review, (review) => review.bookDetail)
    reviews: Review[];
}

export default BookDetail;
