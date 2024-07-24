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
import { BorrowBookDto, CreateBookDto, UpdateBookDto, UploadBookDto, UploadBookDtoExcel } from '../dto/book.dto';
import BookDetail from '../entity/bookDetail.entity';
import ExcelJS from 'exceljs';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import extractValidationErrors from '../utils/extractValidationErrors';
import { CreateBookDetailDto } from '../dto/bookDetail.dto';
import BorrowedHistory from '../entity/borrowedHistory.entity';

class BookService {
    constructor(
        private bookRepository: BookRepository,
        private shelfService: ShelfService,
        private bookDetailsService: BookDetailsService,
        private borrowedHistoryService: BorrowedHistoryService,
        private employeeService: EmployeeService
    ) {}

    uploadBooksFromFile = async (file: Express.Multer.File) => {
        if (!file) {
            throw new HttpException(400, 'File Missing', ['Please upload a file']);
        }
        if (file.buffer.length === 0) {
            throw new HttpException(400, 'Empty file', ['Please upload a valid file']);
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        const jsonData: UploadBookDtoExcel[] = [];
        let isbnColumnIndex: number;
        let codeColumnIndex: number;
        let titleColumnIndex: number;
        let authorColumnIndex: number;
        let descriptionColumnIndex: number;

        worksheet.getRow(1).eachCell((cell, colNumber) => {
            if (cell.value.toString().toLowerCase() === 'isbn') {
                isbnColumnIndex = colNumber;
            } else if (cell.value.toString().toLowerCase() === 'code') {
                codeColumnIndex = colNumber;
            } else if (cell.value.toString().toLowerCase() === 'title') {
                titleColumnIndex = colNumber;
            } else if (cell.value.toString().toLowerCase() === 'author') {
                authorColumnIndex = colNumber;
            } else if (cell.value.toString().toLowerCase() === 'description') {
                descriptionColumnIndex = colNumber;
            }
        });

        if (!isbnColumnIndex || !codeColumnIndex || !titleColumnIndex || !authorColumnIndex || !descriptionColumnIndex) {
            throw new HttpException(400, 'Invalid file', ['File must contain ISBN ,Code,title,author and description columns']);
        }

        worksheet.eachRow(async (row, rowNumber) => {
            if (rowNumber === 1) {
                return; // Skip header row
            }
            const bookData = plainToInstance(UploadBookDtoExcel, {
                isbn: parseInt(row.getCell(isbnColumnIndex).value.toString()),
                code: row.getCell(codeColumnIndex).value.toString(),
                title: row.getCell(titleColumnIndex).value.toString(),
                author: row.getCell(authorColumnIndex).value.toString(),
                description: row.getCell(descriptionColumnIndex).value.toString(),
            });
            const errors = await validate(bookData);
            if (errors.length > 0) {
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, 'Validation failed', error_list);
            }
            jsonData.push(bookData);
        });
        let allBooksAdded;
        try {
            await dataSource.manager.transaction(async (transactionalEntityManager) => {
                allBooksAdded = [];
                for (const book of jsonData) {
                    const bookDetails: BookDetail = await this.bookDetailsService.getBookDetailsById(book.isbn);
                    if (!bookDetails) {
                        const shelfData: Shelf = await this.shelfService.getShelfByCode(book.code);
                        if (!shelfData) {
                            throw new HttpException(404, 'Not found', ['Shelf not found in the database']);
                        }

                        const newbookDetailDto = plainToInstance(CreateBookDetailDto, {
                            isbn: book.isbn,
                            title: book.title,
                            author: book.author,
                            description: book.description,
                        });
                        const newbookDetail = await transactionalEntityManager.save(BookDetail, {
                            isbn: newbookDetailDto.isbn,
                            title: newbookDetailDto.title,
                            author: newbookDetailDto.author,
                            description: newbookDetailDto.description,
                        });

                        const bookData = await transactionalEntityManager.save(Book, {
                            isborrow: false,
                            shelf: shelfData,
                            bookDetail: newbookDetail,
                        });
                        console.log('uploaded book', bookData);
                    } else {
                        if (bookDetails.author !== book.author || bookDetails.title !== book.title || bookDetails.description !== book.description) {
                            throw new HttpException(400, 'Invalid file', ['Book details are not matching with ISBN']);
                        }
                        const shelfData: Shelf = await this.shelfService.getShelfByCode(book.code);
                        if (!shelfData) {
                            throw new HttpException(404, 'Not found', ['Shelf not found in the database']);
                        }

                        const bookData = await transactionalEntityManager.save(Book, {
                            isborrow: false,
                            shelf: shelfData,
                            bookDetail: bookDetails,
                        });
                        console.log('uploaded book', bookData);
                    }
                }
            });
            return allBooksAdded;
        } catch (e) {
            console.error('Failed to upload books:', e);
            if (e instanceof HttpException) {
                throw e;
            }
            return new HttpException(500, 'Internal Server Error', ['Failed to upload books']);
        }
    };

    borrowBook = async (bookDto: BorrowBookDto) => {
        const shelf: Shelf = await this.shelfService.getShelfById(bookDto.shelf_id);
        if (!shelf) {
            throw new HttpException(404, 'Not found', ['Shelf not found']);
        }
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
        let updateBookBorrowedHistory;

        await dataSource.manager.transaction(async (transactionalEntityManager) => {
            updateBookBorrowedHistory = await transactionalEntityManager.save(BorrowedHistory, {
                book,
                borrowedShelf: shelf,
                borrowed_at: today,
                expected_return_date: expectedReturnDate,
                return_date: null,
                returnShelf: null,
                user,
            });
            let updateBook = book;
            updateBook.isborrow = true;
            updateBook.shelf = null;
            const updateBookStatus = await transactionalEntityManager.save(Book, updateBook);
            console.log(updateBookStatus);
        });
        return updateBookBorrowedHistory;
    };

    returnBook = async (bookDTo: BorrowBookDto) => {
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
        toUpdateBook.shelf = shelf;
        let updateborrowedHistoryRecord;
        try {
            await dataSource.manager.transaction(async (transactionalEntityManager) => {
                const updateBook = await transactionalEntityManager.save(Book, toUpdateBook);
                updateborrowedHistoryRecord = await transactionalEntityManager.save(BorrowedHistory, {
                    id: borrowedHistoryRecord.id,
                    return_date,
                    returnShelf: shelf,
                });
            });
            return updateborrowedHistoryRecord;
        } catch (e) {
            console.error('Failed to return book:', e);
            return new HttpException(500, 'Internal Server Error', ['Failed to return book']);
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

    uploadBook = async (book: UploadBookDto) => {
        const bookDetail: BookDetail = await this.bookDetailsService.getBookDetailsById(book.isbn);
        if (!bookDetail) {
            throw new HttpException(404, 'Not found', ['Book not found in the database']);
        }
        const shelfData: Shelf = await this.shelfService.getShelfByCode(book.code);
        if (!shelfData) {
            throw new HttpException(404, 'Not found', ['Shelf not found in the database']);
        }
        const newbook = new Book();
        newbook.isborrow = false;
        newbook.shelf = shelfData;
        newbook.bookDetail = bookDetail;
        console.log('creating new book');
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

    getBookDetailsById = async (id: string) => {
        const { bookDetail } = await this.bookRepository.find({ id: id }, ['bookDetail']);
        // console.log(bookDetail);
        return bookDetail;
    };
}
export default BookService;
