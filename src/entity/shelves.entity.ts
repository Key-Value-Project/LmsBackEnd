import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Unique, OneToMany, Index, PrimaryGeneratedColumn } from "typeorm";
import Book from "./book.entity";
import BorrowedHistory from "./borrowedHistory.entity";

@Entity()
@Unique(["code"])
class Shelf {
	@PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;

	@Index()
	@Column()
	code: string;

	@Column()
	location: string;

	@OneToMany(() => Book, (book) => book.shelf)
	books: Book[];

	@OneToMany(() => BorrowedHistory, (history) => history.borrowedShelf)
	borrowedHistory: BorrowedHistory[];
	
	@OneToMany(() => BorrowedHistory, (history) => history.returnShelf)
	returnedHistory: BorrowedHistory[];
}

export default Shelf;
