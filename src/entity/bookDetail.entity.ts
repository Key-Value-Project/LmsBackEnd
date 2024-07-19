import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import Book from "./book.entity";
import Subscription from "./subscription.entity";

@Entity()
class BookDetail {
    @PrimaryColumn('bigint')
    isbn: number;

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

    @OneToMany(() => Subscription, subscription => subscription.bookDetail)
    subscriptions: Subscription[];

    @OneToMany(() => Book, book => book.bookDetail)
    books: Book[];

}

export default BookDetail;