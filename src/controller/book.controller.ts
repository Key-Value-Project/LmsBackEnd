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
    }

    borrowBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const { isbn, shelf_id } = req.body;
            const user_id = req.id;
            const data = await this.bookService.borrowBook(isbn, shelf_id, Number(user_id));
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    returnBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const { isbn, shelf_id } = req.body;
            const user_id = req.id;
            const data = await this.bookService.returnBook(isbn, shelf_id, Number(user_id));
            res.json(data);
        } catch (err) {
            next(err);
        }
    };
}
export default BooksController;
