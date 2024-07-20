import express from "express";
import BookDetailsService from "../service/book_details.service";
import { log } from "console";
class BookDetailController {
    public router: express.Router;
    constructor(private bookDetailsService: BookDetailsService) {
        this.router = express.Router();
        this.router.get("/", this.getAllBookDetails);
        this.router.get("/:isbn", this.getAllBookDetailsWithBookId);
        this.router.get("/searchby/:title", this.searchBookDetailsWithTitle);
    }
    public getAllBookDetails = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        const bookDetails = await this.bookDetailsService.getAllBookDetails();
        response.send(bookDetails);
    };
    public getAllBookDetailsWithBookId = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        const { isbn } = request.params;
        const bookDetails = await this.bookDetailsService.getAllBookDetailsWithBookId(isbn);
        response.json(bookDetails);
    };
    public searchBookDetailsWithTitle = async (
        request: express.Request,
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
