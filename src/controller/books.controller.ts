import express from "express";
import BookService from "../service/book.service";

class BooksController {
    public router: express.Router;
    constructor(private bookService: BookService) {
        this.router = express.Router();
        // this.router.get("/:isbn", this.getAllbooksByIsbn);
    }
    // getAllbooksByIsbn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    //     console.log("hitting");
    //     const { isbn } = request.params;
    //     console.log("isbn is", isbn);
    //     const books = await this.bookService.getBooksNotBorrowedByIsbn(Number(isbn));
    //     return response.json(books);
    // };
}
export default BooksController;
