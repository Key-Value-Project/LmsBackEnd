import ShelfController from "../controller/shelf.controller";
import AppdataSource from "../db/data-source";
import Shelf from "../entity/shelves.entity";
import ShelfRepository from "../repository/shelf.repository";
import ShelfService from "../service/shelf.service";

const shelfController = new ShelfController(new ShelfService(new ShelfRepository(AppdataSource.getRepository(Shelf))));

const ShelfRouter = shelfController.router;
export default ShelfRouter;
