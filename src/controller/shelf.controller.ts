import express from 'express';
import ShelfService from '../service/shelf.service';
import authorize from '../middleware/auth.middleware';
import Permission from '../utils/permission.roles';
import Role from '../utils/role.enum';
import { RequestWithUser } from '../utils/requestWithUser';
class ShelfController {
    public router: express.Router;
    constructor(private shelfService: ShelfService) {
        this.router = express.Router();
        this.router.get('/', authorize, this.getAllShelfs);
    }
    public getAllShelfs = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        Permission.employeePermission(req, [Role.ADMIN], ['You do not have permission']);
        const shelfs = await this.shelfService.getAllShelves();
        res.json(shelfs);
    };
}
export default ShelfController;
