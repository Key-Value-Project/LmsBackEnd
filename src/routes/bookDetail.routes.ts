import BookDetailController from '../controller/bookDetail.controller';
import AppdataSource from '../db/data-source';
import BookDetail from '../entity/bookDetail.entity';
import { GenreDB } from '../entity/genre.entity';
import BookDetailRepository from '../repository/bookDetail.repository';
import GenreRepository from '../repository/genre.repository';
import BookDetailsService from '../service/bookDetails.service';
import GenreService from '../service/genre.service';

const bookDetailController = new BookDetailController(
    new BookDetailsService(
        new BookDetailRepository(AppdataSource.getRepository(BookDetail)),
        new GenreService(new GenreRepository(AppdataSource.getRepository(GenreDB)))
    )
);
const bookDetailRouter = bookDetailController.router;

export default bookDetailRouter;
