import express from "express";
import ShelfService from "../service/shelf.service";
import authorize from "../middleware/auth.middleware";
import Permission from "../utils/permission.roles";
import Role from "../utils/role.enum";
import { RequestWithUser } from "../utils/requestWithUser";
import HttpException from "../execptions/http.exceptions";
class ShelfController {
    public router: express.Router;
    constructor(private shelfService: ShelfService) {
        this.router = express.Router();
        this.router.get("/", authorize, this.getAllShelfs);

        this.router.post("/create",authorize,this.createShelf)
        this.router.delete("/delete/:id",authorize,this.deleteShelf)
        this.router.put("/update/:id",authorize,this.updateShelf)
    }
    public getAllShelfs = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        Permission.employeePermission(req, [Role.ADMIN], ["You do not have permission"]);
        const shelfs = await this.shelfService.getAllShelves();
        res.json(shelfs);
    };


    public createShelf=async(req: RequestWithUser, res: express.Response, next: express.NextFunction)=>{
        try{
        Permission.employeePermission(req, [Role.ADMIN], ["You do not have permission"]);
        const shelf=req.body
        const shelfdetails = await this.shelfService.createShelf(shelf);
        res.status(201).send(shelfdetails)}
        catch(err){
            if (err.code === "23503") {
                const error = new HttpException(404, "Not found", [
                  "Code or location is not given",
                ]);
                next(error);
              }
            next(err)
        }
    };

    public deleteShelf= async (
        request: RequestWithUser,
        response: express.Response,
        next: express.NextFunction
      ) => {
        {
          try {
            if (!(request.role == Role.ADMIN)) {
              throw new HttpException(403, "Forbidden", [
                "You are not authorized to delete shelves",
              ]);
            }
            const id = request.params.id;
            const bookDetails = await this.shelfService.deleteShelf(id);
            response.send(bookDetails);
          } catch (err) {
            if (err.code === "23503") {
              const error = new HttpException(404, "Not found", [
                "Shelf not found in the database",
              ]);
              next(error);
            }
            next(err);
          }
        }
      };

      public updateShelf=async(
        request: RequestWithUser,
        response: express.Response,
        next: express.NextFunction
    )=>{
        try{
        if (!(request.role==Role.ADMIN)){
            throw new HttpException(403, "Forbidden", ["You are not authorized to update shelves"]);
        }
    
        const id=request.params.id
        const shelf=request.body;
        const bookDetails = await this.shelfService.updateShelf(id,shelf);
        response.send(bookDetails);
    }catch(err){
        if (err.code === "23503") {
            const error = new HttpException(404, "Not found", [
              "Code or location is not given",
            ]);
            next(error);
          }
        next(err)
    }
    };
}
export default ShelfController;
