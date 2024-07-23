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
import { BorrowBookDto, CreateBookDto, UpdateBookDto } from '../dto/book.dto';
import BookDetail from '../entity/bookDetail.entity';
import { IsNull } from 'typeorm';

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
                updateBook.shelf = null;
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

    getAllBooks = async () => {
        const book = await this.bookRepository.findAll({}, ['bookDetail']);
        return book;
    };

    // ADMIN ROUTES
    createBook = async (book: CreateBookDto) => {
        const shelfData: Shelf = await this.shelfService.getShelfById(book.shelf_id);
        if (!shelfData) {
            throw new HttpException(404, 'Not found', ['Shelf not found in the database']);
        }
        const bookDetail: BookDetail = await this.bookDetailsService.getBookDetailsById(book.isbn);
        if (!bookDetail) {
            throw new HttpException(404, 'Not found', ['Book not found in the database']);
        }

        const newbook = new Book();
        newbook.isborrow = false;
        newbook.shelf = shelfData;
        newbook.bookDetail = bookDetail;
        return this.bookRepository.save(newbook);
    };

    deleteBook = async (id: string) => {
        const book = await this.bookRepository.find({ id });
        if (book.isborrow === true) {
            throw new HttpException(400, 'Bad Request', ['Book is borrowed']);
        }
        if (!book) {
            throw new HttpException(404, 'Not found', ['Book not found in the database']);
        }
        await this.bookRepository.softDelete(id);
    };

    updateBooks = async (id: string, book: UpdateBookDto) => {
        const currentBook = await this.bookRepository.find({ id });
        if (currentBook.isborrow === true) {
            throw new HttpException(400, 'Bad Request', ['Book is borrowed']);
        }
        const newBook = new Book();
        if (book.shelf_id) {
            const shelfData: Shelf = await this.shelfService.getShelfById(book.shelf_id);
            if (!shelfData) {
                throw new HttpException(404, 'Not found', ['Shelf not found in the database']);
            }
            newBook.shelf = shelfData;
        }
        if (book.isbn) {
            const bookDetail: BookDetail = await this.bookDetailsService.getBookDetailsById(book.isbn);
            if (!bookDetail) {
                throw new HttpException(404, 'Not found', ['Book not found in the database']);
            }
            newBook.bookDetail = bookDetail;
        }
        return this.bookRepository.update(id, newBook);
    };
}
export default BookService;
