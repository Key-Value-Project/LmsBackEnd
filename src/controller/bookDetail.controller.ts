import express from 'express';
import BookDetailsService from '../service/bookDetails.service';
import authorize from '../middleware/auth.middleware';
import { RequestWithUser } from '../utils/requestWithUser';
import HttpException from '../execptions/http.exceptions';
import Permission from '../utils/permission.roles';
import Role from '../utils/role.enum';
import { plainToInstance } from 'class-transformer';
import { CreateBookDetailDto } from '../dto/bookDetail.dto';
import { validate } from 'class-validator';
class BookDetailController {
    public router: express.Router;

    constructor(private bookDetailsService: BookDetailsService) {
        this.router = express.Router();
        this.router.get('/searchby/:title', authorize, this.searchBookDetailsWithTitle);
        this.router.get('/:isbn', authorize, this.getBookLocationWithBookIsbn);
        this.router.get('/', authorize, this.getAllBookDetails);
        this.router.post('/create', authorize, this.createBookDetail);
    }

    public getAllBookDetails = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const bookDetails = await this.bookDetailsService.getAllBookDetails();
            if (!bookDetails || bookDetails.length === 0) {
                return next(new HttpException(404, 'Books not found'));
            }
            response.send(bookDetails);
        } catch (err) {
            next(err);
        }
    };

    public getBookLocationWithBookIsbn = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const { isbn } = request.params;
            const bookDetails = await this.bookDetailsService.getAllBookDetailsWithBookId(isbn);
            if (!bookDetails || bookDetails.length === 0) {
                return next(new HttpException(404, 'Book not found'));
            }
            response.json(bookDetails);
        } catch (err) {
            next(err);
        }
    };

    public searchBookDetailsWithTitle = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            // console.log('in searchBook details with title');
            const { title } = request.params;
            const bookDetails = await this.bookDetailsService.getSearchBookDetailsWithTitle(title);
            if (!bookDetails) {
                return next(new HttpException(404, 'Book not found'));
            }
            response.json(bookDetails);
        } catch (err) {
            next(err);
        }
    };

    public createBookDetail = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            Permission.userPermission(request, [Role.ADMIN], ['You are not authorized to create book']);
            const bookDetailsDto = plainToInstance(CreateBookDetailDto, request.body);
            const errors = await validate(bookDetailsDto);
            if (errors.length > 0) {
                return next(new HttpException(400, 'Validation failed', errors));
            }
            const bookDetails = await this.bookDetailsService.createBookDetail(bookDetailsDto);
            response.send(bookDetails);
        } catch (err) {
            next(err);
        }
    };
}
export default BookDetailController;
