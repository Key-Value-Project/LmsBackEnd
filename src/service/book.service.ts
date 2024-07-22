import { addMonths, format } from "date-fns";
import Book from "../entity/book.entity";
import BookRepository from "../repository/books.repository";
import BookDetailsService from "./book_details.service";
import BorrowedHistoryService from "./borrowedHistory.service";
import ShelfService from "./shelf.service";
import EmployeeService from "./employee.service";

class BookService {
    constructor(
        private bookRepository: BookRepository,
        private shelfService: ShelfService,
        private bookDetailsService: BookDetailsService,
        private borrowedHistoryService: BorrowedHistoryService,
        private employeeService: EmployeeService
    ) {}
    // getBooksNotBorrowedByIsbn = async (isbn: number) => {
    //     const bookDetail = await this.bookDetailsService.getBookDetailsById(isbn);
    //     console.log(bookDetail);
    //     let fetchedBooks = await this.bookRepository.findAll({}, ["shelf", "bookDetail"]);
    //     fetchedBooks = fetchedBooks.filter((book) => {
    //         if (book.bookDetail.isbn.toString() === isbn.toString()) return book;
    //     });
    //     return fetchedBooks;
    // };
    borrowBook = async (isbn: number, shelf_id: string, user_id: number) => {
        const shelf = await this.shelfService.getShelfById(shelf_id);
        const book: Book = await this.bookRepository.find(
            {
                shelf: {
                    id: shelf.id,
                },
                bookDetail: {
                    isbn,
                },
                isborrow: false,
            },
            ["shelf", "bookDetail"]
        );
        let today: Date = new Date();
        const expected_return_date = format(addMonths(today, 1), "yyyy-MM-dd");
        const date = format(today, "yyyy-MM-dd");
        const user = await this.employeeService.getEmployeeById(user_id);
        console.log(shelf, book, user);
        try {
            const updateBookBorrowedHistory = await this.borrowedHistoryService.insertBorrowedHistory(
                book,
                shelf,
                date,
                expected_return_date,
                user
            );
            let updateBook = book;
            updateBook.isborrow = true;
            const updateBookStatus = await this.bookRepository.save(updateBook);
            console.log(updateBookStatus);
            return updateBookBorrowedHistory;
        } catch (e) {
            console.log(e);
            return e;
        }
    };
    returnBook = async (isbn: number, shelf_id: string, user_id: number) => {
        const shelf = await this.shelfService.getShelfById(shelf_id);
        const user = await this.employeeService.getEmployeeById(user_id);
        console.log("user", user);
        const borrowedHistoryRecord = await this.borrowedHistoryService.getByBorrowedHistory(isbn, user_id);
        let today: Date = new Date();
        const return_date = format(today, "yyyy-MM-dd");
        let toupdateBook = await this.bookRepository.find({ id: borrowedHistoryRecord.book.id });
        toupdateBook.isborrow = false;
        const updateBook = await this.bookRepository.save(toupdateBook);
        const updateborrowedHistoryRecord = await this.borrowedHistoryService.updateBorrowedHistory(
            borrowedHistoryRecord.id,
            shelf,
            return_date
        );
        return updateborrowedHistoryRecord;
    };

    getBookDetailsById = async (id: string) => {
        const {bookDetail} = await this.bookRepository.find({id: id})
        return bookDetail
    }
}
export default BookService;
