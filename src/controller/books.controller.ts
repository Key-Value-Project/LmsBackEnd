import express from 'express';
import BookService from '../service/book.service';
import { RequestWithUser } from '../utils/requestWithUser';
import authorize from '../middleware/auth.middleware';

class BooksController {
    public router: express.Router;
    constructor(private bookService: BookService) {
        this.router = express.Router();
        this.router.post('/borrow', authorize, this.borrowBook);
        this.router.post('/return', authorize, this.returnBook);
        // this.router.get("/:isbn", this.getAllbooksByIsbn);
    }
    // getAllbooksByIsbn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    //     console.log("hitting");
    //     const { isbn } = request.params;
    //     console.log("isbn is", isbn);
    //     const books = await this.bookService.getBooksNotBorrowedByIsbn(Number(isbn));
    //     return response.json(books);
    // };
    borrowBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const { isbn, shelf_id } = req.body;
        const user_id = req.id;
        const data = await this.bookService.borrowBook(isbn, shelf_id, Number(user_id));
        res.json(data);
    };
    returnBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const { isbn, shelf_id } = req.body;
        const user_id = req.id;
        const data = await this.bookService.returnBook(isbn, shelf_id, Number(user_id));
        res.json(data);
    };
}
export default BooksController;
