import { Column, Entity, ManyToOne } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Employee from "./employee.entity";
import Shelf from "./shelves.entity";
import Book from "./book.entity";

@Entity()
class BorrowedHistory extends AbstractEntity {
	@Column()
	borrowed_at: Date;

	@Column()
	expected_return_date: Date;

	@Column({ nullable: true })
	return_date: Date;

	@ManyToOne(() => Employee, (employee) => employee.borrowedHistory)
	user: Employee;

	@ManyToOne(() => Shelf, (shelf) => shelf.borrowedHistory)
	borrowedShelf: Shelf;

	@ManyToOne(() => Shelf, (shelf) => shelf.returnedHistory)
	returnShelf: Shelf;

	@ManyToOne(() => Book, (book) => book.borrowedHistory)
	book: Book;
}

export default BorrowedHistory;
