import Book from "../entity/book.entity";
import BookRepository from "../repository/books.repository";
import BookDetailsService from "./book_details.service";

class BookService {
    constructor(private bookRepository: BookRepository, private bookDetailsService: BookDetailsService) {}
    // getBooksNotBorrowedByIsbn = async (isbn: number) => {
    //     const bookDetail = await this.bookDetailsService.getBookDetailsById(isbn);
    //     console.log(bookDetail);
    //     let fetchedBooks = await this.bookRepository.findAll({}, ["shelf", "bookDetail"]);
    //     fetchedBooks = fetchedBooks.filter((book) => {
    //         if (book.bookDetail.isbn.toString() === isbn.toString()) return book;
    //     });
    //     return fetchedBooks;
    // };
    // borrowBook= async(isbn:number,shelf_id:string)=>{
    //     const shelf =
    // }
}
export default BookService;
