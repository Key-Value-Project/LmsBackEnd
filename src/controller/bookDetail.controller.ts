import express from "express";
import BookDetailsService from "../service/bookDetails.service";
import { log } from "console";
import authorize from "../middleware/auth.middleware";
import { RequestWithUser } from "../utils/requestWithUser";
import HttpException from "../execptions/http.exceptions";
import Role from "../utils/role.enum";
class BookDetailController {
  public router: express.Router;
  constructor(private bookDetailsService: BookDetailsService) {
    this.router = express.Router();
    this.router.get("/", authorize, this.getAllBookDetails);
    this.router.get("/:isbn", authorize, this.getAllBookDetailsWithBookId);
    this.router.get(
      "/searchby/:title",
      authorize,
      this.searchBookDetailsWithTitle
    );

    this.router.post("/create", authorize, this.createBookDetail);
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
    const bookDetails =
      await this.bookDetailsService.getAllBookDetailsWithBookId(isbn);
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
    const bookDetails =
      await this.bookDetailsService.getSearchBookDetailsWithTitle(title);
    response.json(bookDetails);
  };

  //ADMIN ROUTES

  public createBookDetail = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (!(request.role == Role.ADMIN)) {
        throw new HttpException(403, "Forbidden", [
          "You are not authorized to add books",
        ]);
      }
      const book = request.body;
      console.log(book);
      const bookDetails = await this.bookDetailsService.createBookDetail(book);
      response.send(bookDetails);
    } catch (err) {
      next(err);
    }
  };
}
export default BookDetailController;
