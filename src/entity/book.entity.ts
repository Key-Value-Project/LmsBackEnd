import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Shelf from "./shelves.entity";
import BookDetail from "./bookDetail.entity";
import BorrowedHistory from "./borrowedHistory.entity";

@Entity()
class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;

	@Column()
	isborrow: boolean;

	@ManyToOne(() => Shelf, (shelf) => shelf.books)
	shelf: Shelf;

	@ManyToOne(() => BookDetail, (bookDetail) => bookDetail.books)
	bookDetail: BookDetail;

	@OneToMany(() => BorrowedHistory, (borrowedHistory) => borrowedHistory.book)
	borrowedHistory: BorrowedHistory[];
}

export default Book;
