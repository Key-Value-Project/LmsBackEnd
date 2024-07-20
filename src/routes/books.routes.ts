import BooksController from "../controller/books.controller";
import AppdataSource from "../db/data-source";
import Book from "../entity/book.entity";
import BookDetail from "../entity/bookDetail.entity";
import BookDetailRepository from "../repository/bookDetail.repository";
import BookRepository from "../repository/books.repository";
import BookService from "../service/book.service";
import BookDetailsService from "../service/book_details.service";

const booksController = new BooksController(
    new BookService(
        new BookRepository(AppdataSource.getRepository(Book)),
        new BookDetailsService(new BookDetailRepository(AppdataSource.getRepository(BookDetail)))
    )
);
const booksRouter = booksController.router;
export default booksRouter;
