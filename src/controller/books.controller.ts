import express from "express";
import BookService from "../service/book.service";

class BooksController {
    public router: express.Router;
    constructor(private bookService: BookService) {
        this.router = express.Router();
        this.router.post("/borrow", this.borrowBook);
        this.router.post("/return", this.returnBook);
        // this.router.get("/:isbn", this.getAllbooksByIsbn);
    }
    // getAllbooksByIsbn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    //     console.log("hitting");
    //     const { isbn } = request.params;
    //     console.log("isbn is", isbn);
    //     const books = await this.bookService.getBooksNotBorrowedByIsbn(Number(isbn));
    //     return response.json(books);
    // };
    borrowBook = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { isbn, shelf_id, user_id } = req.body;
        const data = await this.bookService.borrowBook(isbn, shelf_id, Number(user_id));
        res.json(data);
    };
    returnBook = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { isbn, shelf_id, user_id } = req.body;
        const data = await this.bookService.returnBook(isbn, shelf_id, Number(user_id));
        res.json(data);
    };
}
export default BooksController;
