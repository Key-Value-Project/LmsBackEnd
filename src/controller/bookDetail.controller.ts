import express from "express";
import BookDetailsService from "../service/book_details.service";
import { log } from "console";
import authorize from "../middleware/auth.middleware";
import { RequestWithUser } from "../utils/requestWithUser";
import HttpException from "../execptions/http.exceptions";
class BookDetailController {
    public router: express.Router;
    constructor(private bookDetailsService: BookDetailsService) {
        this.router = express.Router();
        this.router.get("/", authorize, this.getAllBookDetails);
        this.router.get("/:isbn", authorize, this.getAllBookDetailsWithBookId);
        this.router.get("/searchby/:title", authorize, this.searchBookDetailsWithTitle);
    }
    public getAllBookDetails = async (
        request: RequestWithUser,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const bookDetails = await this.bookDetailsService.getAllBookDetails();
            response.send(bookDetails);
        } catch (e) {
            throw new HttpException(500, "internal server error");
        }
    };
    public getAllBookDetailsWithBookId = async (
        request: RequestWithUser,
        response: express.Response,
        next: express.NextFunction
    ) => {
        const { isbn } = request.params;
        const bookDetails = await this.bookDetailsService.getAllBookDetailsWithBookId(isbn);
        response.json(bookDetails);
    };
    public searchBookDetailsWithTitle = async (
        request: RequestWithUser,
        response: express.Response,
        next: express.NextFunction
    ) => {
        console.log("in searchBook details with title");
        const { title } = request.params;
        console.log(title);
        const bookDetails = await this.bookDetailsService.getSearchBookDetailsWithTitle(title);
        response.json(bookDetails);
    };
}
export default BookDetailController;
