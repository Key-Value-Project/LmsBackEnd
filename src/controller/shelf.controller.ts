import express from "express";
import ShelfService from "../service/shelf.service";
class ShelfController {
    public router: express.Router;
    constructor(private shelfService: ShelfService) {
        this.router = express.Router();
        this.router.get("/", this.getAllShelfs);
    }
    public getAllShelfs = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const shelfs = await this.shelfService.getAllShelves();
        res.json(shelfs);
    };
}
export default ShelfController;
