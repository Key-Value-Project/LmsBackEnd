import express from 'express';
import BookService from '../service/book.service';
import { RequestWithUser } from '../utils/requestWithUser';
import authorize from '../middleware/auth.middleware';
import { plainToInstance } from 'class-transformer';
import { BorrowBookDto, CreateBookDto, UpdateBookDto } from '../dto/book.dto';
import Permission from '../utils/permission.roles';
import Role from '../utils/role.enum';
import HttpException from '../execptions/http.exceptions';
import extractValidationErrors from '../utils/extractValidationErrors';
import { validate } from 'class-validator';
import upload from '../utils/fileUpload';

class BooksController {
    public router: express.Router;

    constructor(private bookService: BookService) {
        this.router = express.Router();
        this.router.get('/borrowhistory', authorize, this.getBorrowHistory);
        this.router.get('/', authorize, this.getAllBooks);
        this.router.post('/borrow', authorize, this.borrowBook);
        this.router.post('/return', authorize, this.returnBook);
        this.router.post('/create', authorize, this.createBook);
        this.router.post('/upload', authorize, upload.single('file'), this.uploadFile); // New route for file upload
        this.router.patch('/update/:id', authorize, this.updateBook);
        this.router.delete('/delete/:id', authorize, this.deleteBook);
    }

    public uploadFile = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            if (!req.file) {
                throw new HttpException(400, 'No file uploaded', ['Please upload a file']);
            }
            // Process the uploaded file here
            const data = await this.bookService.uploadBooksFromFile(req.file);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public borrowBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const { isbn, shelf_id } = req.body;
            const user_id = req.id;
            const borrowBookDto = plainToInstance(BorrowBookDto, { isbn, shelf_id, user_id });
            const errors = await validate(borrowBookDto);
            if (errors.length > 0) {
                throw new HttpException(400, 'Validation failed', errors);
            }
            const data = await this.bookService.borrowBook(borrowBookDto);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public returnBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const { isbn, shelf_id } = req.body;
            const user_id = req.id;
            const returnBookDto = plainToInstance(BorrowBookDto, { isbn, shelf_id, user_id });
            const errors = await validate(returnBookDto);
            if (errors.length > 0) {
                throw new HttpException(400, 'Validation failed', errors);
            }
            const data = await this.bookService.returnBook(returnBookDto);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getBorrowHistory = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const user_id = req.id;
            const data = await this.bookService.getBorrowedBooks(user_id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getAllBooks = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const data = await this.bookService.getAllBooks();
        res.json(data);
    };

    public createBook = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            Permission.userPermission(request, [Role.HR, Role.ADMIN], ['You are not authorized to create books']);
            const bookDto = plainToInstance(CreateBookDto, request.body);
            const errors = await validate(bookDto);
            if (errors.length) {
                // console.log(errors);
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, 'Validation failed', error_list);
            }
            const bookDetails = await this.bookService.createBook(bookDto);
            response.send(bookDetails);
        } catch (err) {
            if (err.code === '23503') {
                const error = new HttpException(404, 'Not found', ['Shelf or book not found in the database']);
                next(error);
            }
            next(err);
        }
    };

    public deleteBook = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            Permission.userPermission(request, [Role.HR, Role.ADMIN], ['You are not authorized to delete books']);
            const id = request.params.id;
            const bookDetails = await this.bookService.deleteBook(id);
            response.send(bookDetails);
        } catch (err) {
            if (err.code === '23503') {
                const error = new HttpException(404, 'Not found', ['Book not found in the database']);
                next(error);
            }
            next(err);
        }
    };

    public updateBook = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            Permission.userPermission(request, [Role.HR, Role.ADMIN], ['You are not authorized to update books']);
            const id = request.params.id;
            const bookDto = plainToInstance(UpdateBookDto, request.body);
            const errors = await validate(bookDto);
            if (errors.length) {
                // console.log(errors);
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, 'Validation failed', error_list);
            }
            const bookDetails = await this.bookService.updateBooks(id, bookDto);
            response.send(bookDetails);
        } catch (err) {
            if (err.code === '23503') {
                const error = new HttpException(404, 'Not found', ['Book not found in the database']);
                next(error);
            }
            next(err);
        }
    };
}
export default BooksController;
