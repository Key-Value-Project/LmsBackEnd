import express from 'express';
import ShelfService from '../service/shelf.service';
import authorize from '../middleware/auth.middleware';
import Permission from '../utils/permission.roles';
import Role from '../utils/role.enum';
import { RequestWithUser } from '../utils/requestWithUser';
import HttpException from '../execptions/http.exceptions';
import { plainToInstance } from 'class-transformer';
import { CreateShelfDto, UpdateShelfDto } from '../dto/shelf.dto';
import { validate } from 'class-validator';
import extractValidationErrors from '../utils/extractValidationErrors';

class ShelfController {
    public router: express.Router;

    constructor(private shelfService: ShelfService) {
        this.router = express.Router();
        this.router.get('/', authorize, this.getAllShelfs);
        this.router.post('/create', authorize, this.createShelf);
        this.router.put('/update/:id', authorize, this.updateShelf);
        this.router.delete('/delete/:id', authorize, this.deleteShelf);
    }

    public getAllShelfs = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            Permission.userPermission(req, [Role.ADMIN, Role.DEVELOPER, Role.HR, Role.TESTER, Role.UI, Role.UX], ['You do not have permission']);
            const shelfs = await this.shelfService.getAllShelves();

            res.json(shelfs);
        } catch (err) {
            next(err);
        }
    };

    public createShelf = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            Permission.userPermission(req, [Role.ADMIN], ['You do not have permission']);
            const shelfDto = plainToInstance(CreateShelfDto, req.body);
            const errors = await validate(shelfDto);

            if (errors.length) {
                // console.log(errors);
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, 'Validation failed', error_list);
            }
            const shelfdetails = await this.shelfService.createShelf(shelfDto);
            res.status(201).send(shelfdetails);
        } catch (err) {
            if (err.code === '23505') {
                const error = new HttpException(400, 'Bad Request', ['Shelf already exists']);
                next(error);
            }
            next(err);
        }
    };

    public deleteShelf = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        {
            try {
                Permission.userPermission(request, [Role.ADMIN], ['You do not have permission']);
                const id = request.params.id;
                const bookDetails = await this.shelfService.deleteShelf(id);
                response.send(bookDetails);
            } catch (err) {
                if (err.code === '23503') {
                    const error = new HttpException(404, 'Not found', ['Shelf not found in the database']);
                    next(error);
                }
                next(err);
            }
        }
    };

    public updateShelf = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            Permission.userPermission(request, [Role.ADMIN], ['You do not have permission']);

            const id = request.params.id;
            const shelfDto = plainToInstance(UpdateShelfDto, request.body);
            const errors = await validate(shelfDto);
            if (errors.length) {
                // console.log(errors);
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, 'Validation failed', error_list);
            }
            const bookDetails = await this.shelfService.updateShelf(id, shelfDto);
            response.send(bookDetails);
        } catch (err) {
            if (err.code === '23503') {
                const error = new HttpException(404, 'Not found', ['Code or location is not given']);
                next(error);
            }
            next(err);
        }
    };
}
export default ShelfController;
