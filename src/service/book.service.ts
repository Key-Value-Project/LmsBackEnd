import { addMonths } from 'date-fns';
import Book from '../entity/book.entity';
import BookRepository from '../repository/books.repository';
import BookDetailsService from './bookDetails.service';
import BorrowedHistoryService from './borrowedHistory.service';
import ShelfService from './shelf.service';
import EmployeeService from './employee.service';
import Shelf from '../entity/shelves.entity';
import HttpException from '../execptions/http.exceptions';
import dataSource from '../db/data-source';
import { BorrowBookDto } from '../dto/book.dto';

class BookService {
    constructor(
        private bookRepository: BookRepository,
        private shelfService: ShelfService,
        private bookDetailsService: BookDetailsService,
        private borrowedHistoryService: BorrowedHistoryService,
        private employeeService: EmployeeService
    ) {}

    borrowBook = async (bookDto: BorrowBookDto) => {
        try {
            const shelf: Shelf = await this.shelfService.getShelfById(bookDto.shelf_id);
            if (!shelf) {
                throw new HttpException(404, 'Not found', ['Shelf not found']);
            }
            console.log(bookDto.isbn);
            const book: Book = await this.bookRepository.find(
                {
                    shelf: {
                        id: shelf.id,
                    },
                    bookDetail: { isbn: bookDto.isbn },
                    isborrow: false,
                },
                ['shelf', 'bookDetail']
            );
            if (!book) {
                throw new HttpException(404, 'Not found', ['Book not found for the given shelf']);
            }
            let today: Date = new Date();
            const expectedReturnDate: Date = addMonths(today, 1);
            const user = await this.employeeService.getEmployeeById(bookDto.user_id);
            if (!user) {
                throw new HttpException(404, 'Not found', ['User not found']);
            }

            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const updateBookBorrowedHistory = await this.borrowedHistoryService.insertBorrowedHistory(
                    book,
                    shelf,
                    today,
                    expectedReturnDate,
                    user
                );
                let updateBook = book;
                updateBook.isborrow = true;
                const updateBookStatus = await this.bookRepository.save(updateBook);
                console.log(updateBookStatus);
                await queryRunner.commitTransaction();
                return updateBookBorrowedHistory;
            } catch (transactionError) {
                console.log(transactionError);
                await queryRunner.rollbackTransaction();
                return transactionError;
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    returnBook = async (bookDTo: BorrowBookDto) => {
        try {
            const shelf = await this.shelfService.getShelfById(bookDTo.shelf_id);
            if (!shelf) {
                throw new HttpException(404, 'Not found', ['Shelf not found']);
            }
            const user = await this.employeeService.getEmployeeById(bookDTo.user_id);
            if (!user) {
                throw new HttpException(404, 'Not found', ['User not found']);
            }
            const borrowedHistoryRecord = await this.borrowedHistoryService.getByBorrowedHistory(bookDTo.isbn, bookDTo.user_id);
            console.log('borrowed history', borrowedHistoryRecord);
            if (!borrowedHistoryRecord) {
                throw new HttpException(404, 'Not found', ['Borrowed History not found']);
            }
            const return_date: Date = new Date();
            let toUpdateBook = await this.bookRepository.find({ id: borrowedHistoryRecord.book.id });
            if (!toUpdateBook) {
                throw new HttpException(404, 'Not found', ['Book not found']);
            }
            toUpdateBook.isborrow = false;

            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const updateBook = await this.bookRepository.save(toUpdateBook);
                const updateborrowedHistoryRecord = await this.borrowedHistoryService.updateBorrowedHistory(
                    borrowedHistoryRecord.id,
                    shelf,
                    return_date
                );
                return updateborrowedHistoryRecord;
            } catch (e) {
                await queryRunner.rollbackTransaction();
                console.error('Failed to return book:', e);
                return new HttpException(500, 'Internal Server Error', ['Failed to return book']);
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            console.error('Failed to return book:', error);
            return error;
        }
    };

    getBorrowedBooks = async (user_id: number) => {
        const BorrowedHistory = await this.borrowedHistoryService.getByBorrowedHistoryOfUser(user_id);
        return BorrowedHistory;
    };
}
export default BookService;
