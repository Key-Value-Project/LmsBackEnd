import BookDetailController from "../controller/bookDetail.controller";
import AppdataSource from "../db/data-source";
import BookDetail from "../entity/bookDetail.entity";
import BookDetailRepository from "../repository/bookDetail.repository";
import BookDetailsService from "../service/book_details.service";

const bookDetailController = new BookDetailController(
    new BookDetailsService(new BookDetailRepository(AppdataSource.getRepository(BookDetail)))
);
const bookDetailRouter = bookDetailController.router;

export default bookDetailRouter;
